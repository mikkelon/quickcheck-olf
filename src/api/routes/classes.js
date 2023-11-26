import express from "express";
import {
  getClasses,
  getClassById,
  getStudentsByClassId,
} from "../controllers/classesController.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const classes = await getClasses();
    res.status(200).send(classes);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af klasser");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const clazz = await getClassById(id);
    res.status(200).send(clazz);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af klasser");
  }
});

router.get("/:classId/students", async (req, res) => {
  const classId = req.params.classId;
  try {
    const students = await getStudentsByClassId(classId);
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

export default router;
