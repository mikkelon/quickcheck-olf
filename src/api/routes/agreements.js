import express from "express";
import { adminDB } from "../../config/firebase-admin.js";
import {
  createAgreement,
  deleteAgreement,
  getAgreementByStudentId,
} from "../controllers/agreementsController.js";

const router = express.Router();

// Opret aftale
router.post("/", async (req, res) => {
  console.log("create agreement request:", req.body);
  if (!req.body) {
    throw new Error("Fejl - manglende data");
  }
  const agreement = req.body;
  try {
    const agreementId = await createAgreement(agreement);
    // Send response back to client
    res.status(201).send({
      message: "Aftale oprettet",
      data: { agreementId },
    });
  } catch (error) {
    console.log(error.message);
    // Send error response back to client
    res.status(500).send({
      message: "Fejl ved oprettelse af aftale",
      data: {
        error,
      },
    });
  }
});

// GET aftaler
router.get("/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  console.log("getting agreements for studentId:", studentId);
  try {
    const agreements = await getAgreementByStudentId(studentId);
    res.status(200).send(agreements);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af aftaler");
  }
});

// Slet aftale
router.delete("/:agreementId", async (req, res) => {
  const agreementId = req.params.agreementId;
  try {
    await deleteAgreement(agreementId);
    res.status(200).send("Aftale slettet");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - aftale findes ikke.");
  }
});

export default router;
