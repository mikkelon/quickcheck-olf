import express from "express";
import { db } from "../firebase.js";
import { addDoc, collection, doc, deleteDoc, updateDoc, getDoc, query, where, getDocs, setDoc, DocumentReference } from "firebase/firestore";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const studentsDocs = await getDocs(collection(db, "students"));
        const students = studentsDocs.docs.map(doc => doc.data());
        res.status(200).send(students);
    } catch (error) {
        console.log(error);
        res.status(400).send("Fejl ved hentning af elever");
    }
});

/* Hent elever i en klasse */
// TODO: classId er ikke en attribut på student endnu
router.get("/:classId", async (req, res) => {
    const classId = req.params.classId;
    try {
        const studentsDocs = await getDocs(
            collection(db, "students"),
            where("classId", "==", classId)
        );
        const students = studentsDocs.docs.map(doc => doc.data());
        res.status(200).send(students);
    } catch (error) {
        console.log(error);
        res.status(400).send("Fejl ved hentning af elever");
    }
});

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
    } catch (error) {
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
        const querySnapshot = await getDocs(query(collection(db, "students"), where("checkedIn", "==", true)));
        const students = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send(students);
    } catch (error) {
        console.log(error);
        res.status(404).send("Fejl - elever ikke fundet.");
    }
});


/* Opdater elev tilstedeværelse */
router.put("/toggleCheckedIn/:id", async (req, res) => {


    try {
        const studentId = req.params.id;
        const docRef = doc(db, "students", studentId);
        const studentDoc = await getDoc(docRef);

        if (!studentDoc.exists()) {
            throw new Error("Eleven findes ikke.");
        }
        const currentCheckedInStatus = studentDoc.data().checkedIn;
        const updatedCheckedInStatus = !currentCheckedInStatus;
        await updateDoc(docRef, { "checkedIn": updatedCheckedInStatus });
        res.status(200).send(`Elevens checkedIn opdateres: ${updatedCheckedInStatus}`);
    } catch (error) {
        console.log(error);
        res.status(404).send("Fejl - kunne ikke opdatere elev.");
    }
});


export default router;
