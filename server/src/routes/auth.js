import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
    res.send("Loggin in...");
});

export default router;
