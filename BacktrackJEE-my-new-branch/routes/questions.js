import express from 'express';
import mongoose from 'mongoose';
import Mapping from '../models/Mapping.js';
const router = express.Router();

import authenticateUser from '../middleware/authmiddleware.js';

const openPapers = ['jee2020-2', 'jee2020-1'];

// Open access route (no authentication)
router.get('/:paperId/questions', async (req, res, next) => {
  const { paperId } = req.params;
  if (!openPapers.includes(paperId)) return next();
  try {
    const mapping = await Mapping.findOne({ paperId });
    if (!mapping) {
      return res.status(404).json({ success: false, message: "Paper not found." });
    }
    const collectionName = mapping.collectionName;
    const db = mongoose.connection.db;
    const papers = await db.collection(collectionName).find({}).toArray();
    const paperObj = papers[0] || {};
    const questions = paperObj.questions || [];
    const note = paperObj.note || null;
    if (!questions.length) {
      return res.status(404).json({ success: false, message: "No questions found for this paper." });
    }
    return res.json({ success: true, data: { questions, note } });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error.", 
      error: error.message 
    });
  }
});

// Authenticated route (for all other papers)
router.get('/:paperId/questions', authenticateUser, async (req, res) => {
  const { paperId } = req.params;
  try {
    const mapping = await Mapping.findOne({ paperId });
    if (!mapping) {
      return res.status(404).json({ success: false, message: "Paper not found." });
    }
    const collectionName = mapping.collectionName;
    const db = mongoose.connection.db;
    const papers = await db.collection(collectionName).find({}).toArray();
    const paperObj = papers[0] || {};
    const questions = paperObj.questions || [];
    const note = paperObj.note || null;
    if (!questions.length) {
      return res.status(404).json({ success: false, message: "No questions found for this paper." });
    }
    return res.json({ success: true, data: { questions, note } });
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