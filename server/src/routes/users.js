import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Users!");
});

router.get("/:id", (req, res) => {
    res.send(`User with id: ${req.params.id}`);
});

export default router;
