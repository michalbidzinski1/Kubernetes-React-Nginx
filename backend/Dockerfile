FROM node:latest
WORKDIR /backend
COPY ./package.json .
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]