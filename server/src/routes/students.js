import express, { response } from "express";
import { db } from "../firebase.js";
import { addDoc, collection } from "firebase/firestore";
const router = express.Router();



/* Opret elev */
router.post("/", async (req, res) => {
    console.log(req.body);

    try {
        const doc = await addDoc(collection(db, "students"), req.body);
        res.status(201).send("Elev oprettet");
    } catch (error) {
        console.log(error);
        res.status(400).send("Fejl ved oprettelse af elev");
    }
});


export default router;
