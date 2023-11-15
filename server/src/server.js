// init express and write endpoints
import express from "express";
import auth from "./routes/auth.js";
import students from "./routes/students.js";
import classes from "./routes/classes.js";
import parents from "./routes/parents.js";
import cors from "cors";

const app = express();
const port = 6969;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", auth);
app.use("/students", students);
app.use("/classes", classes);
app.use("/parents", parents);


app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
