import express from "express";
import authenticateUser from "../middleware/authmiddleware.js";
import User from "../models/user.js";
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// GET /dashboard-data: Returns analytics and purchased papers
router.get("/dashboard-data", authenticateUser, async (req, res) => {
  try {
    // --- Fetch Analytics  ---
    await client.connect();
    const database = client.db('Mains');
    const userId = req.user.id;

    // Fetch all completed tests for this user
    const userTests = await database.collection('results')
      .find({ userId: userId })
      .toArray();

    let analytics = {
      testsCompleted: 0,
      averageScore: 0,
      topSubject: 'None',
      studyHours: 0
    };

    if (userTests && userTests.length > 0) {
      analytics.testsCompleted = userTests.length;
      analytics.averageScore = Math.round(userTests.reduce((sum, test) => sum + (test.score / test.maxPossibleScore * 100), 0) / userTests.length);
      analytics.studyHours = Math.round(userTests.reduce((sum, test) => sum + (test.timeSpent / 60), 0));

      // Find top subject
      const paperIds = [...new Set(userTests.map(test => test.paperId))];
      const mappings = await database.collection('mappings').find({ paperId: { $in: paperIds } }).toArray();
      const papers = [];
      for (const mapping of mappings) {
        const paperId = mapping.paperId;
        const collectionName = mapping.collectionName;
        if (!collectionName) continue;
        try {
          const paperData = await database.collection(collectionName).findOne({ _id: paperId });
          if (paperData) {
            papers.push({ _id: paperId, subject: paperData.subject || 'Unknown' });
          }
        } catch (error) { /* ignore */ }
      }
      const paperSubjects = {};
      papers.forEach(paper => { paperSubjects[paper._id.toString()] = paper.subject; });
      const subjectScores = {};
      userTests.forEach(test => {
        const subject = paperSubjects[test.paperId.toString()];
        if (!subject) return;
        if (!subjectScores[subject]) subjectScores[subject] = { totalScore: 0, totalPossible: 0, count: 0 };
        subjectScores[subject].totalScore += test.score;
        subjectScores[subject].totalPossible += test.maxPossibleScore;
        subjectScores[subject].count += 1;
      });
      let topSubject = 'None', highestAverage = 0;
      for (const [subject, data] of Object.entries(subjectScores)) {
        const average = data.totalScore / data.totalPossible * 100;
        if (average > highestAverage) {
          highestAverage = average;
          topSubject = subject;
        }
      }
      analytics.topSubject = topSubject;
    }

    // --- Fetch Purchased Papers ---
    const user = await User.findById(userId);
    const purchasedPapers = user?.purchasedPapers || [];

    // --- Respond with both ---
    res.json({ success: true, analytics, purchasedPapers });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data', error: error.message });
  } finally {
    // Optionally: await client.close();
  }
});

export default router;
