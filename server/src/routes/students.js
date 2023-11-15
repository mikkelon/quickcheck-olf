import express, { response } from "express";
import { db } from "../firebase.js";
import { addDoc, collection, getDocs } from "firebase/firestore";
const router = express.Router();

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

export default router;
