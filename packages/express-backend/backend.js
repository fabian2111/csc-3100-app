import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {addUser, getUsers, findUserById, findUserByName, findUserByJob, removeUser} from "./services/user-service.js";

dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;


mongoose.set("debug", true);
mongoose
.connect(MONGO_CONNECTION_STRING + "users")
.catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    }
  ],
};

// function addIdToUser(user) {
//   const new_user = {
//     id: `${Math.random()}`,
//     name: user.name,
//     job: user.job
//   };
//   return new_user
// }

// const findUserByName = (name) => {
//   return users["users_list"].filter((user) => user["name"] === name);
// };

// const findUserById = (id) =>
//   users["users_list"].find((user) => user["id"] === id);

// const addUser = (user) => {
//   const new_user = addIdToUser(user);
//   users["users_list"].push(new_user);
//   return new_user;
// };

// const removeUser = (id) =>
//   users["users_list"].filter((user) => user["id"] !== id);

const findUsersByNameAndJob = (name, job) =>
  users["users_list"].filter((user) => user["name"] === name && user["job"] === job);


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if(name !== undefined && job !== undefined){
      let result = findUsersByNameAndJob(name, job);
      res.send(result);
    }
    else if(name !== undefined){
      let result = findUserByName(name).then((user) => user);
      result = { users_list: result };
      res.send(result);
    } else {
      getUsers(name, job)
      .then((users) => res.send(users))
      .catch((e) => console.log("could not find users"))
      //res.send(users);
    }
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
  const new_user = addUser(userToAdd).then((user) => user);
  res.status(201).send(new_user);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id).then((user) => user);
  if(result === undefined){
    res.status(404).send("Cannot find user");
  } else {
    removeUser(id)
    .then(res.status(204).send())
    .catch((e) => res.status(404).send(e));
    // res.status(204).send();
  }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
