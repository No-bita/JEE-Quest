import express from "express";
import { 
  saveAttempt, 
  checkAttempt, 
  getAttemptDetails,
  getUserAttempts 
} from "../controllers/attemptController.js";
import { authenticateToken } from "../middleware/auth.js";
import { checkExistingAttempt } from "../middleware/attemptCheck.js";

const router = express.Router();

// Save a new attempt with results
router.post("/save", authenticateToken, checkExistingAttempt, saveAttempt);

// Check if attempt exists
router.get("/check", authenticateToken, checkAttempt);

// Get attempt details with results
router.get("/:paperId", authenticateToken, getAttemptDetails);

// Get all attempts for the user
router.get("/user", authenticateToken, getUserAttempts);

export default router;
