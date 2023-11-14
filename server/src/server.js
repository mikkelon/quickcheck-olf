// init express and write endpoints
import express from "express";
import users from "./routes/users.js";
import auth from "./routes/auth.js";
import students from "./routes/students.js";

const app = express();
const port = 6969;
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/users", users);
app.use("/auth", auth);
app.use("/students", students)


app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});


