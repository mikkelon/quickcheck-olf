import express, { response } from "express";
import { db } from "../firebase.js";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
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
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Opdater elev */
router.put("/:id", async (req, res) => {
  try {
    let id = req.params.id;

    if (!id && typeof id !== "string") {
      throw new Error("Id should be string and not be empty");
    }
    let student = req.body;
    const docRef = doc(db, "students", id);

    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      throw new Error("Student id not found");
    }

    if (student.name) {
      if (typeof student.name !== "string") {
        throw new Error("Name should be a string");
      }
    }

    if (student.classId) {
      if (typeof student.classId !== "string") {
        throw new Error("classId should be a string");
      }
      const classes = await getDoc(collection(db, "classes"));
      const classFound = classes.some((doc) => doc.id === student.classId);
      if (!classFound) {
        throw new Error("Class not found");
      }
    }

    if (student.birthday) {
      if (
        typeof student.birthday !== "string" ||
        student.birthday.trim().length !== 8
      ) {
        throw new Error("Birthday should be a string with 8 digits (MMDDYYYY)");
      }
    }

    if (student.checkedIn) {
      if (typeof student.checkedIn !== "boolean") {
        throw new Error("checkedIn should be a boolean");
      }
    }
    await updateDoc(docRef, student);
    res.status(200).send("Elev opdateret");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

export default router;
