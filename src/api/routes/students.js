import express from "express";
import {
  getStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
  toggleCheckedInStatus,
} from "../controllers/studentsController.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const students = await getStudents();
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await getStudentById(id);
    res.status(200).send(student);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl - kunne ikke hente elev.");
  }
});

/* Slet elev */
router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    await deleteStudent(id);
    res.status(200).send("Elev slettet");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Opdater elev */
router.put("/:id", async (req, res) => {
  let id = req.params.id;
  const updatedStudent = req.body;

  try {
    await updateStudent(id, updatedStudent);
    res.status(200).send("Elev opdateret");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Opdater elev tilstedeværelse */
router.put("/toggleCheckedIn/:id", async (req, res) => {
  const studentId = req.params.id;
  try {
    await toggleCheckedInStatus(studentId);
    res
      .status(200)
      .send(
        `Elevens (${studentId}) checkedIn opdateres til det modsatte af det nuværende`
      );
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - kunne ikke opdatere elev.");
  }
});

export default router;
