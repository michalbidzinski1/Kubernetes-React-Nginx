import { useState, useEffect } from "react";
import Config from "./config";
import axios from "axios";
import "./App.css";
const host = Config.backend_host;
function App() {
  const [mongoNotes, setMongoNotes] = useState([]);
  const [redisNotes, setRedisNotes] = useState([]);

  const [mongoNote, setMongoNote] = useState("");
  const [redisNote, setRedisNote] = useState("");

  useEffect(() => {
    getAllNotes();
  }, []);

  const getAllNotes = () => {
    axios
      .get(`${host}/mongo`)
      .then((res) => setMongoNotes(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`${host}/redis`)
      .then((res) => setRedisNotes(res.data))
      .catch((err) => console.log(err));
  };

  const handleSubmitMongo = (e) => {
    e.preventDefault();
    setMongoNote("");
    axios
      .post(`${host}/mongo`, { contentMongo: mongoNote })
      .then((res) => setMongoNotes([...mongoNotes, res.data]))
      .catch((err) => console.log(err));
  };
  const handleDeleteMongo = (id) =>
    axios
      .delete(`${host}/mongo/${id}`)
      .then(() => setMongoNotes(mongoNotes.filter((note) => note._id !== id)))
      .catch((err) => console.log(err));

  const handleSubmitRedis = (e) => {
    e.preventDefault();
    setRedisNote("");
    axios
      .post(`${host}/redis`, { content: redisNote })
      .then((res) => setRedisNotes([...redisNotes, res.data]))
      .catch((err) => console.log(err));
  };

  const handleDeleteRedis = (id) =>
    axios
      .delete(`${host}/redis/${id}`)
      .then(() => setRedisNotes(redisNotes.filter((note) => note.id !== id)))
      .catch((err) => console.log(err));

  return (
    <div>
      <div className="wrapper">
        <div className="left">
          <h2>Mongo</h2>
          <div className="x">
            <form className="form" onSubmit={handleSubmitMongo}>
              <input
                onChange={(e) => setMongoNote(e.target.value)}
                value={mongoNote}
              ></input>
              <button className="add" type="submit">
                Add
              </button>
            </form>
            <div className="content">
              {mongoNotes.map((note) => (
                <div className="note" key={note._id}>
                  {note.contentMongo}
                  <button
                    className="dbutton"
                    onClick={() => handleDeleteMongo(note._id)}
                  ></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="right">
          <h2>Redis</h2>
          <div className="x">
            <form className="form" onSubmit={handleSubmitRedis}>
              <input
                onChange={(e) => setRedisNote(e.target.value)}
                value={redisNote}
              ></input>
              <button className="add" type="submit">
                Add
              </button>
            </form>

            <div className="content">
              {redisNotes.map((note) => (
                <div className="note" key={note.id}>
                  {note.content}
                  <button
                    className="dbutton"
                    onClick={() => handleDeleteRedis(note.id)}
                  ></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
