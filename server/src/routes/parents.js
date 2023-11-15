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
  console.log(req.body);

  try {
    const doc = await addDoc(collection(db, "parents"), req.body);
    res.status(201).send("Forælder oprettet");
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved oprettelse af forælder");
  }
});

/* Slet elev */
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

export default router;
