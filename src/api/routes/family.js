import express from "express";
import {
  createFamily,
  rollbackFamilyCreation,
} from "../controllers/familyController.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  console.log("create family request:", req.body);

  // Rough data validation
  if (!req.body) {
    throw new Error("Fejl - manglende data");
  } else if (!req.body.students || !req.body.parents) {
    throw new Error("Fejl - manglende data");
  }

  // Get data from HTTP request
  const students = req.body.students;
  const parents = req.body.parents;

  try {
    const parentsId = await createFamily(parents, students);
    // Send response back to client
    res.status(201).send({
      message: "Familie oprettet",
      data: {
        parentsId,
      },
    });
  } catch (error) {
    console.log(error.message);

    // Send error response back to client
    res.status(500).send({
      message: "Fejl ved oprettelse af familie",
      data: {
        error,
      },
    });
  }
});

export default router;
