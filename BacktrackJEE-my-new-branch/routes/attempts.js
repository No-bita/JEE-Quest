import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { saveAttempt, checkAttempt } from "../controllers/attemptController.js";

const router = express.Router();

// Save a new attempt
router.post("/save", authMiddleware, saveAttempt);
// Check if user already attempted a paper
router.get("/check", authMiddleware, checkAttempt);

export default router;
