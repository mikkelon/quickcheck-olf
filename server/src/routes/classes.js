import express, { response } from "express";
import { db } from "../firebase.js";
import { getDocs, collection } from "firebase/firestore";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const classesDocs = await getDocs(collection(db, "classes"));
        const classes = classesDocs.docs.map(doc => doc.data());
        res.status(200).send(classes);
    } catch (error) {
        console.log(error);
        res.status(400).send("Fejl ved hentning af klasser");
    }
});

export default router;
