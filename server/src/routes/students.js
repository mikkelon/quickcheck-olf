import express, { response } from "express";
import { db } from "../firebase.js";
import { addDoc, collection, doc, deleteDoc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
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

/* Slet elev */
router.delete("/:id", async (req, res) => {
    let id = req.params.id;

    try {
        const docDelete = await deleteDoc(doc(db, "students", id));
        res.status(200).send("Elev slettet");
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Fejl - eleven findes ikke.");
    }
});

/* Opdater elev */
router.put("/:id", async (req, res) => {
    let id = req.params.id;

    try {
        const docRef = doc(db, "students", id);
        await updateDoc(docRef, req.body);
        res.status(200).send("Elev opdateret");
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Fejl - eleven findes ikke.");
    }
});

/* Hent elever tilstede*/
router.get("/checkedIn", async (req, res) => {
    try {
        // const fbQuery = query(collection(db, "students"), where("checkedIn", "==", true));
        // const studentsDocs = await getDocs(collection(db, "students"), where("checkedIn", "==", true));
        const querySnapshot = await getDocs(query(collection(db, "students"), where("checkedIn", "==", true)));
        // const students = [];
        const students = querySnapshot.docs.map(doc => doc.data());
        console.log(students);
        res.status(200).send(students);
    } catch (error) {
        console.log(error);
        res.status(404).send("Fejl - elever ikke fundet.");
    }
});

export default router;
