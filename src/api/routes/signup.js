import express from "express";
import { createEmployeeUser } from "../controllers/signupController.js";
const router = express.Router();

router.post("/employee", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await createEmployeeUser(email, password);

    console.log("Successfully created new user:", userRecord.uid);
    res.status(200).send({
      message: "Successfully created new user",
      data: {
        uid: userRecord.uid,
      },
    });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send({
      message: "Error creating new user",
      data: {
        error: error.message, // Sending only the error message for better client-side handling
      },
    });
  }
});

export default router;
