import express from "express";
import { createParents } from "./parents";
import { createStudentsWithParentsId } from "./students";

const router = express.Router();

router.post("/create", async (req, res) => {
  console.log("create family request:", req.body);

  // Rough data validation
  if (!req.body) {
    throw new Error("Fejl - manglende data");
  } else if (!req.body.students || !req.body.parents) {
    throw new Error("Fejl - manglende data");
  }

  const students = req.body.students;
  const parents = req.body.parents;
  let parentsId;

  try {
    // Create parent document
    parentsId = await createParents(parents);

    // Create student documents
    await createStudentsWithParentsId(students, parentsId);

    res.status(201).send("Familie oprettet");
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved oprettelse af familie");
  }
});

export default router;
