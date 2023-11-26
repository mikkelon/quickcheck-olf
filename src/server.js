// init express and write endpoints
import express from "express";
import students from "./api/routes/students.js";
import classes from "./api/routes/classes.js";
import notes from "./api/routes/notes.js";
import parents from "./api/routes/parents.js";
import signup from "./api/routes/signup.js";
import family from "./api/routes/family.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "public");

const app = express();
const port = 6969;
app.use(express.static(publicPath));
app.use(express.json());
app.use(cors());

app.use("/students", students);
app.use("/classes", classes);
app.use("/notes", notes);
app.use("/parents", parents);
app.use("/signup", signup);
app.use("/family", family);

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
