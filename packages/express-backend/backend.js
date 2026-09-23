import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {addUser, getUsers, findUserById, findUserByName, findUserByJob, removeUser} from "./services/user-service.js";

// dotenv.config();
// const { MONGO_CONNECTION_STRING } = process.env;


// mongoose.set("debug", true);
// mongoose
// .connect(MONGO_CONNECTION_STRING + "users")
// .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

      getUsers(name, job)
      .then((users) => res.send(users))
      .catch((e) => console.log(e))

});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id).then((user) => user);
  if(result === undefined){
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd).then((user) => res.status(201).send(user));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

    removeUser(id)
    .then(res.status(204).send())
    .catch((e) => res.status(404).send(e));

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
