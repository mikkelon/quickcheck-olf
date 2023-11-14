import express, { response } from "express";
import {db} from "../firebase.js";
import { addDoc, collection } from "firebase/firestore";
const router = express.Router();



router.post("/", (req, res) => {
    console.log(req.body);

    try {
        addDoc(collection(db, "students"), req.body);
    } catch (error) {
        console.log("Fejl");
    }
    res.status(201);
    res.send("Elev oprettet");
});


export default router;
