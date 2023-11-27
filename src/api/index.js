import express from "express";

import students from "./routes/students.js";
import classes from "./routes/classes.js";
import notes from "./routes/notes.js";
import parents from "./routes/parents.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import family from "./routes/family.js";

const router = express.Router();

router.use("/students", students);
router.use("/classes", classes);
router.use("/notes", notes);
router.use("/parents", parents);
router.use("/signup", signup);
router.use("/login", login);
router.use("/family", family);

export default router;
