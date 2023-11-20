import express from "express";
import { db } from "../firebase.js";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const parentsDocs = await getDocs(collection(db, "parents"));
    const parents = parentsDocs.docs.map((doc) => doc.data());
    res.status(200).send(parents);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

/* Hent forælder */
router.get("/:classId", async (req, res) => {
  const classId = req.params.classId;
  console.log(classId);
  try {
    const firebaseQuery = query(
      collection(db, "parents"),
      where("uid", "==", classId)
    );
    const parentsDocs = await getDocs(firebaseQuery);
    const parents = parentsDocs.docs.map((doc) => doc.data());
    res.status(200).send(parents);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

/* Opret forælder */
router.post("/", async (req, res) => {
  try {
    const doc = await addDoc(collection(db, "parents"), req.body);
    // Get students where parent id is in childrenIds
    const firebaseQuery = query(
      collection(db, "students"),
      where("parentId", "in", req.body.childrenIds)
    );
    // Add parent id to students
    const studentsDocs = await getDocs(firebaseQuery);
    const students = studentsDocs.docs.map((doc) => doc.data());
    const studentsWithParent = students.map((student) => {
      return { ...student, parentId: doc.id };
    });
    // Update students
    studentsWithParent.forEach(async (student) => {
      await addDoc(collection(db, "students"), student);
    });
    res.status(201).send({ id: doc.id, ...req.body });
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved oprettelse af forælder");
  }
});

/* Slet forælder */
router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const docDelete = await deleteDoc(doc(db, "parents", id));
    res.status(200).send("Forælder slettet");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - forælder findes ikke.");
  }
});

/* Se børn */
router.get("/:parentsID/students", async (req, res) => {
  const parentsID = req.params.parentsID;
  try {
    const firebaseQuery = query(
      collection(db, "students"),
      where("parentsID", "==", parentsID)
    );
    const studentsDocs = await getDocs(firebaseQuery);
    const students = studentsDocs.docs.map((doc) => doc.data());
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

export default router;
