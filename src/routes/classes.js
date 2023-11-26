import express from "express";
import { db } from "../firebase.js";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const classesDocs = await getDocs(collection(db, "classes"));
    const classes = classesDocs.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    res.status(200).send(classes);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af klasser");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const docRef = doc(db, "classes", id);
    const docSnap = await getDoc(docRef);
    const clazz = docSnap.data();
    res.status(200).send(clazz);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af klasser");
  }
});

/* Hent elever i en klasse */
// TODO: classId er ikke en attribut på student endnu
router.get("/:classId/students", async (req, res) => {
  const classId = req.params.classId;
  try {
    const firebaseQuery = query(
      collection(db, "students"),
      where("classId", "==", classId)
    );
    const studentsDocs = await getDocs(firebaseQuery);
    const students = studentsDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

export default router;
