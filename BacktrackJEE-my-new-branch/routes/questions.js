import express from 'express';
import mongoose from 'mongoose';
import Mapping from '../models/Mapping.js';
const router = express.Router();

// Route to fetch questions for a specific paper
router.get("/:paperId/questions", async (req, res) => {
  const { paperId } = req.params;
  console.log(`Fetching questions for paper: ${paperId}`);

  try {
    // Find the collection name from the mapping
    const mapping = await Mapping.findOne({ paperId });
    console.log(`Mapping found:`, mapping);
    
    if (!mapping) {
      console.log(`No mapping found for paperId: ${paperId}`);
      return res.status(404).json({ success: false, message: "Paper not found." });
    }

    const collectionName = mapping.collectionName;
    console.log(`Collection name from mapping: ${collectionName}`);

    // Direct MongoDB collection access
    const db = mongoose.connection.db;
    const questions = await db.collection(collectionName).find({}).toArray();
    console.log(`Found ${questions.length} questions`);
    
    if (!questions.length) {
      return res.status(404).json({ success: false, message: "No questions found for this paper." });
    }
    
    // Return the questions with success flag for frontend
    return res.json({ success: true, data: questions });
    
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error.", 
      error: error.message 
    });
  }
});

export default router;