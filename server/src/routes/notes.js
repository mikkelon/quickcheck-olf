import express from "express";
import { db } from "../firebase.js";
import { addDoc, collection, updateDoc, getDoc, doc } from "firebase/firestore";

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

export default router;
