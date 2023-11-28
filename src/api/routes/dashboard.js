import express from "express";
import { getButtonsForRole } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sessionCookie = req.cookies.__session || "";

  try {
    const buttonsForRole = await getButtonsForRole(sessionCookie);

    res.status(200).send(buttonsForRole);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af knapper");
  }
});

export default router;
