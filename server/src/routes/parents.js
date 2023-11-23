import express from "express";
import { db } from "../firebase.js";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const parentsDocs = await getDocs(collection(db, "parents"));
    const parents = parentsDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).send(parents);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

/* Hent forældre med id */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const docRef = doc(db, "parents", id);
    const docSnap = await getDoc(docRef);
    const parent = { id: docSnap.id, ...docSnap.data() };
    res.status(200).send(parent);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

/* Opret forælder */
// Example of request body:
// {
//   parentsId: "string";
//   name: "string";
//   email: "string";
//   phone: "string";
// }
// Can only add a new parent to an existing parents object
router.post("/", async (req, res) => {
  const parentsId = req.body.parentsId;

  const newParent = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  // Data validation
  if (!parentsId || !newParent.name || !newParent.email || !newParent.phone) {
    throw new Error("Fejl - manglende data");
  }

  // Check if parents object exists
  try {
    const docRef = doc(db, "parents", parentsId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Fejl - forælder findes ikke");
    }

    const parents = docSnap.data().parents;
    parents.push(newParent);
    await updateDoc(docRef, { parents });
    res.status(201).send("Forælder oprettet");
  } catch (error) {
    console.log(error.message);
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
router.get("/:parentsId/students", async (req, res) => {
  const parents = req.params.parentsId;
  try {
    const firebaseQuery = query(
      collection(db, "students"),
      where("parents", "==", parents)
    );
    const studentsDocs = await getDocs(firebaseQuery);
    const students = studentsDocs.docs.map((doc) => ({
      id: doc.id, // Include the student ID
      ...doc.data(),
    }));
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

export const createParents = async (parents) => {
  if (!parents || parents.length === 0) {
    throw new Error("Fejl - manglende data");
  }

  parents.forEach((parent) => {
    if (!parent.name || !parent.email || !parent.phone) {
      throw new Error("Fejl - manglende data");
    }
  });

  try {
    const docRef = await addDoc(collection(db, "parents"), { parents });
    console.log("Parents object created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(error);
    throw new Error("Fejl ved oprettelse af forælder");
  }
};

export default router;
