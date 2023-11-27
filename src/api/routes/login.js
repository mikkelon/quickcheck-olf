import express from "express";
import { createSessionCookie } from "../controllers/authController.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { idToken } = req.body;

  try {
    const { sessionCookie, options } = await createSessionCookie(idToken);

    res.cookie("__session", sessionCookie, options);
    res.end(JSON.stringify({ status: "success" }));
  } catch (error) {
    console.error(error);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
});

export default router;
