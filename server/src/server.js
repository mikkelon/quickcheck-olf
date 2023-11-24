// init express and write endpoints
import express from "express";
import students from "./routes/students.js";
import classes from "./routes/classes.js";
import notes from "./routes/notes.js";
import parents from "./routes/parents.js";
import signup from "./routes/signup.js";
import family from "./routes/family.js";

import cors from "cors";

const app = express();
const port = 6969;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/students", students);
app.use("/classes", classes);
app.use("/notes", notes);
app.use("/parents", parents);
app.use("/signup", signup);
app.use("/family", family);

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
