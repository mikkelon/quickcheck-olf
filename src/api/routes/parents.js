import express from "express";
import {
  getParents,
  getParentById,
  getStudentsByParentsId,
  deleteParents,
  addParent,
  getStudentsBySessionCookie,
  updateParents,
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

/* Slet en enkelt forælder fra et parents objekt ud fra index i parents arrayet */
router.delete("/:id/:index", async (req, res) => {
  const id = req.params.id;
  const index = req.params.index;

  try {
    const parent = await getParentById(id);
    const parents = parent.parents;
    parents.splice(index, 1);
    await updateParents(id, { parents });
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
  console.log("updating parents with id:", id);
  console.log("updating parents with body:", req.body);

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
  console.log("yooodfdsgdo");

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

/* Opdater parents */
router.put("/:id", async (req, res) => {
  let id = req.params.id;
  const updatedParents = req.body;

  try {
    await updateParents(id, updatedParents);
    res.status(200).send("Forælder opdateret");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - forælder findes ikke.");
  }
});

/* Opret forælder */
// Can only add a new parent to an existing parents object
router.post("/:id", async (req, res) => {
  const parentsId = req.params.id;

  const newParent = {
    name: req.body.name,
    relation: req.body.relation,
    email: req.body.email,
    phone: req.body.phone,
  };

  // Check if parents object exists
  try {
    // Data validation
    if (
      !parentsId ||
      !newParent.name ||
      !newParent.relation ||
      !newParent.email ||
      !newParent.phone
    ) {
      throw new Error("Fejl - manglende data");
    }

    await addParent(parentsId, newParent);
    res.status(201).send("Forælder oprettet");
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Fejl ved oprettelse af forælder");
  }
});

export default router;
