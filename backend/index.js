const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const mongoose = require("mongoose");
const mongoConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "local",
};
mongoose
  .connect(
    `mongodb://${mongoConnData.host}:${mongoConnData.port}/${mongoConnData.database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`Connected to MongoDB."`);
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
const noteSchema = new mongoose.Schema({
  contentMongo: { type: String, required: true },
});
const Note = mongoose.model("Note", noteSchema);

const Redis = require("ioredis");
const redisConnData = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};
const client = new Redis({
  host: redisConnData.host,
  port: redisConnData.port,
});
client.on("error", (err) => console.log(err));
client.on("connect", () => {
  console.log(`Connected to Redis.`);
});
const app = express();

app.use(express.json());
app.use(cors());

app.get("/mongo", async (req, res) => {
  try {
    const notes = await Note.find({});
    res.send(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/mongo", async (req, res) => {
  try {
    const note = new Note(req.body);
    note.save();
    res.send(note);
  } catch (err) {
    res.send({ err });
  }
});

app.delete("/mongo/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    !note ? res.send("No such item") : res.status(200).send();
  } catch (err) {
    res.send(err);
  }
});

app.get("/redis", async (req, res) => {
  try {
    const notes = await client.hgetall("notes");
    res.send(Object.entries(notes).map((e) => ({ id: e[0], content: e[1] })));
  } catch (err) {
    res.send(err);
  }
});

app.post("/redis", async (req, res) => {
  try {
    const id = uuid();
    client.hset("notes", id, req.body.content);
    res.send({
      id: id,
      content: req.body.content,
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/redis/:id", async (req, res) => {
  try {
    const note = await client.hdel("notes", req.params.id);
    !note ? res.send("No item ") : res.status(200).send();
  } catch (err) {
    res.send(err);
  }
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
