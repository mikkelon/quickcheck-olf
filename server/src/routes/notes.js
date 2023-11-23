import express from "express";
import { db } from "../firebase.js";
import { addDoc, collection, updateDoc, getDoc, doc, getDocs, query, where } from "firebase/firestore";

const router = express.Router();

router.post("/:studentId", async (req, res) => {
  try {
    let studentId = req.params.studentId;
    let note = req.body;

    note.studentId = studentId;

    const noteDoc = await addDoc(collection(db, "notes"), note);
    res.status(200).send(`Note tilføjet`);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved oprettelse af note");
  }
});


router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    console.log(studentId)


    const noteQuery = query(collection(db, "notes"), where("studentId", "==", studentId))
    const notesDocs = await getDocs(noteQuery)

    const notes = notesDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    })

    res.status(200).send(notes);
  } catch (error) {
    console.error("Fejl: ", error);
    res.status(500).send({ error: "Fejl ved hentning af noter" });
  }
});


export default router;
