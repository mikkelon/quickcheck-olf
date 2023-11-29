import express from "express";
import {
  getParents,
  getParentById,
  getStudentsByParentsId,
  deleteParents,
  addParent,
  getStudentsBySessionCookie,
  getParentInfoBySessionCookie,
} from "../controllers/parentsController.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const parents = await getParents();
    res.status(200).send(parents);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

/* Se børn ud fra session cookie */
router.get("/students", async (req, res) => {
  const sessionCookie = req.cookies.__session || "";
  try {
    const students = await getStudentsBySessionCookie(sessionCookie);
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
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
    await addParent(parentsId, newParent);
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
    await deleteParents(id);
    res.status(200).send("Forælder slettet");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - forælder findes ikke.");
  }
});

/* Se børn */
router.get("/:parentsId/students", async (req, res) => {
  const parentsId = req.params.parentsId;
  console.log("getting students by parentid:", parentsId);
  try {
    const students = await getStudentsByParentsId(parentsId);
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await updateParents(id, req.body);
    res.status(200).send("Forælder opdateret");
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Fejl ved opdatering af forælder");
  }
});

// Hent forældre info ud fra session cookie
router.get("/info", async (req, res) => {

  const sessionCookie = req.cookies.__session || "";
  try {
    const parent = await getParentInfoBySessionCookie(sessionCookie);
    res.status(200).send(parent);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

/* Hent forældre med id */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const parent = await getParentById(id);
    res.status(200).send(parent);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af forælder");
  }
});

export default router;
