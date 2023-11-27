import express from "express";
import { db } from "../../public/utility/firebase.js";
import {
  addDoc,
  collection,
  updateDoc,
  getDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

const router = express.Router();

// Opret note
router.post("/", async (req, res) => {
  const note = req.body;

  /*   console.log(req.body) */
  try {
    const docRef = await addDoc(collection(db, "notes"), note);

    const addedNote = {
      id: docRef.id,
      ...note,
    };

    res.status(200).send("Note tilføjet: " + addedNote);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved oprettelse af note");
  }
});

// GET noter
router.get("/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    console.log(studentId);

    const noteQuery = query(
      collection(db, "notes"),
      where("studentId", "==", studentId)
    );
    const notesDocs = await getDocs(noteQuery);

    const notes = notesDocs.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });

    res.status(200).send(notes);
  } catch (error) {
    console.error("Fejl: ", error);
    res.status(500).send({ error: "Fejl ved hentning af noter" });
  }
});

// Slet note
router.delete("/:noteId", async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const noteRef = doc(db, "notes", noteId);

    await deleteDoc(noteRef);

    res.status(200).send({ message: "Note slettet med succes" });
  } catch (error) {
    console.error("Fejl: ", error);
    res.status(500).send({ error: "Fejl ved sletning af note" });
  }
});

export default router;
