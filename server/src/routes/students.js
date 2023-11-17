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
    const studentsDocs = await getDocs(collection(db, "students"));
    const students = studentsDocs.docs.map((doc) => doc.data());
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
  console.log(classId);
  try {
    const firebaseQuery = query(
      collection(db, "students"),
      where("classId", "==", classId)
    );
    const studentsDocs = await getDocs(firebaseQuery);
    const students = studentsDocs.docs.map((doc) => doc.data());
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

/* Opret elev(er) */
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    let student = req.body;
    let finalStudent = {};
    if (student.name && student.classId && student.birthday) {
      if (typeof student.name == "string") {
        finalStudent.name = student.name;
      } else {
        throw new Error("Name should be a string");
      }
      if (typeof student.classId == "string") {
        const classes = await getDocs(collection(db, "classes"));
        let found = false;
        classes.forEach((doc) => {
          if (doc.id == student.classId) {
            found = true;
            finalStudent.classId = doc.id;
          }
        });
        if (!found) {
          throw new Error("Class not found");
        }
      } else {
        throw new Error("classId should be string");
      }
      if (
        typeof student.birthday === "string" &&
        student.birthday.length === 8
      ) {
        finalStudent.birthday = student.birthday;
      } else {
        throw new Error("Birthday should be string and 8 digits");
      }
    }
    finalStudent.checkedIn = false;
    const doc = await addDoc(collection(db, "students"), finalStudent);
    res.status(201).send("Elev oprettet");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.toString());
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
