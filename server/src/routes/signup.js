import express from "express";
const router = express.Router();

/**
 * Route for signing up a new parent user.
 * POST body should contain:
 * - email
 * - parentId
 */
router.post("/parent", (req, res) => {
  res.send("Loggin in...");
});

export default router;
