// init express and write endpoints
import express from "express";
import { login } from "./logic/login.js";

const app = express();
const port = 6969;

app.get("/", (req, res) => {
  const result = login("test", "test");
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
