import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// API endpoint to get user statistics
router.get('/:userId', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Mains');
    
    const userId = req.params.userId;
    
    // Fetch all completed tests for this user
    const userTests = await database.collection('results')
      .find({ userId: userId })
      .toArray();
    
    if (!userTests || userTests.length === 0) {
      return res.json({
        testsCompleted: 0,
        averageScore: 0,
        topSubject: 'None',
        studyHours: 0
      });
    }
    
    // Calculate tests completed
    const testsCompleted = userTests.length;
    
    // Calculate average score (as percentage)
    const averageScore = userTests.reduce((sum, test) => {
      return sum + (test.score / test.maxPossibleScore * 100);
    }, 0) / testsCompleted;
    
    // Calculate total study hours
    const studyHours = userTests.reduce((sum, test) => {
      return sum + (test.timeSpent / 60); // Assuming timeSpent is in minutes
    }, 0);
    
    // Determine top subject
    // First, fetch paper details to get subject information
    const paperIds = [...new Set(userTests.map(test => test.paperId))];
    const paperObjectIds = paperIds.map(id => 
      typeof id === 'string' ? new ObjectId(id) : id
    );
    
    const papers = await database.collection('papers')
      .find({ _id: { $in: paperObjectIds } })
      .toArray();
    
    // Create a map of paperId to subject
    const paperSubjects = {};
    papers.forEach(paper => {
      paperSubjects[paper._id.toString()] = paper.subject;
    });
    
    // Count scores by subject
    const subjectScores = {};
    userTests.forEach(test => {
      const subject = paperSubjects[test.paperId.toString()];
      if (!subject) return;
      
      if (!subjectScores[subject]) {
        subjectScores[subject] = {
          totalScore: 0,
          totalPossible: 0,
          count: 0
        };
      }
      
      subjectScores[subject].totalScore += test.score;
      subjectScores[subject].totalPossible += test.maxPossibleScore;
      subjectScores[subject].count += 1;
    });
    
    // Find top subject by average score
    let topSubject = 'None';
    let highestAverage = 0;
    
    for (const [subject, data] of Object.entries(subjectScores)) {
      const average = data.totalScore / data.totalPossible * 100;
      if (average > highestAverage) {
        highestAverage = average;
        topSubject = subject;
      }
    }
    
    // Return the statistics as JSON
    res.json({
      testsCompleted,
      averageScore: Math.round(averageScore), // Round to whole number
      topSubject,
      studyHours: Math.round(studyHours) // Round to whole number
    });
    
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();  // Uncomment if you want to close connection after each request
  }
});

export default router;