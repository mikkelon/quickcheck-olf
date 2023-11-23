import express from "express";
import { db } from "../firebase.js";
import { addDoc, collection, updateDoc, getDoc, doc, getDocs } from "firebase/firestore";

const router = express.Router();

router.post("/:studentId", async (req, res) => {
  try {
    let studentId = req.params.studentId;
    let note = req.body;

    const noteDoc = await addDoc(collection(db, "notes"), note);
    let noteId = noteDoc.id;

    const docRef = doc(db, "students", studentId);

    const studentDoc = await getDoc(docRef);

    if (!studentDoc.exists()) {
      throw new Error("Eleven findes ikke.");
    }
    const currentNotes = studentDoc.data().notes || [];
    const updatedNotes = [...currentNotes, noteId];
    await updateDoc(docRef, { notes: updatedNotes });
    res.status(200).send(`Note opdateret`);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved oprettelse af note");
  }
});


router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    console.log(studentId)


    const docSnap = await getDoc(doc(db, "students", studentId));

    console.log(docSnap.data().notes)

    const noteIds = docSnap.data().notes

    res.status(200).send(noteIds);
  } catch (error) {
    console.error("Fejl: ", error);
    res.status(500).send({ error: "Fejl ved hentning af noter" });
  }
});


export default router;
