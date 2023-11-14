import express, { response } from "express";
const router = express.Router();

let students = [];

router.post("/", (req, res) => {
    console.log(req.body);
    students.push(req.body);
    res.status(201);
    res.send("Elev oprettet");
});




export default router;
