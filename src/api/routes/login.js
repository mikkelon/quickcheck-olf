import express from "express";
import { logIn } from "../controllers/authController.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await logIn(email, password);

    res.status(200).send({
      message: "Successfully logged in",
      data: {
        uid: userRecord.uid,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({
      message: "Error logging in",
      data: {
        error: error.message,
      },
    });
  }
});

export default router;
