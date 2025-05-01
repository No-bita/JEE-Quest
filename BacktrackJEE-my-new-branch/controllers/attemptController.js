import Attempt from "../models/Attempt.js";
import User from "../models/user.js";
import getQuestionModel from "../models/Question.js";

// Save a new attempt (POST /api/attempts/save)
export const saveAttempt = async (req, res) => {
  try {
    const requiredFields = [
      "paperId", "answers", "questionTimings", 
      "timeSpent", "score", "maxPossibleScore"
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    const { paperId, answers, questionTimings, timeSpent, score, maxPossibleScore } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    // Validate existing attempt first
    const existingAttempt = await Attempt.findOne({ userId, paperId });
    if (existingAttempt) {
      return res.status(409).json({ 
        message: "Attempt already exists for this user and paper.",
        existingId: existingAttempt._id
      });
    }

    const newAttempt = new Attempt({
      userId,
      userName,
      paperId,
      answers: answers.map(answer => ({
        ...answer,
        timestamp: new Date() // Add server-side timestamp
      })),
      questionTimings,
      timeSpent,
      score,
      maxPossibleScore,
      date: new Date() // Server-generated date
    });

    await newAttempt.save();

    return res.status(201).json({
      success: true,
      attemptId: newAttempt._id,
      score: newAttempt.score
    });

  } catch (error) {
    console.error("Save Attempt Error:", {
      user: req.user?.id,
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      error: "Failed to save attempt. Please try again later."
    });
  }
};

// Check existing attempt (GET /api/attempts/check?paperId=...)
export const checkAttempt = async (req, res) => {
  try {
    const { paperId } = req.query;
    if (!paperId) {
      return res.status(400).json({
        valid: false,
        error: "paperId query parameter is required"
      });
    }

    const attempt = await Attempt.findOne({
      userId: req.user.id,
      paperId
    }).select("_id score createdAt");

    return res.json({
      exists: !!attempt,
      attemptDetails: attempt || null
    });

  } catch (error) {
    console.error("Check Attempt Error:", {
      user: req.user?.id,
      error: error.message
    });
    return res.status(500).json({
      error: "Failed to check attempt status"
    });
  }
};

// Get exam results (GET /api/attempts/results/:paperId)
export const getExamResults = async (req, res) => {
  try {
    const { paperId } = req.params;
    const userId = req.user.id;

    const attempt = await Attempt.findOne({ userId, paperId })
      .populate("responses.question", "question_text correctOption")
      .lean();

    if (!attempt) {
      return res.status(404).json({ 
        error: "No attempt found for this exam",
        solution: "Complete the exam first or check the paper ID"
      });
    }

    // Calculate time metrics
    const timeTaken = attempt.endTime && attempt.startTime
      ? Math.round((attempt.endTime - attempt.startTime) / (1000 * 60))
      : 0;

    // Format review data
    const reviewData = attempt.responses.map(response => ({
      questionId: response.question._id,
      questionText: response.question.question_text,
      userAnswer: response.selectedOption || "⏺ Skipped",
      correctAnswer: response.question.correctOption,
      resultStatus: response.isCorrect 
        ? "✅ Correct" 
        : response.selectedOption 
          ? "❌ Incorrect" 
          : "⚪ Skipped",
      marksEarned: response.marksObtained,
      timeSpent: response.timeSpent
    }));

    // Compile performance summary
    const performanceSummary = {
      totalMarks: attempt.totalMarks,
      questionsAttempted: attempt.attemptedQuestions,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      skippedQuestions: attempt.totalQuestions - attempt.attemptedQuestions,
      timeTakenMinutes: timeTaken,
      accuracyPercentage: ((attempt.correctAnswers / attempt.attemptedQuestions) * 100).toFixed(1),
      attemptStatus: attempt.status
    };

    return res.status(200).json({
      meta: {
        paperId: attempt.paperId,
        attemptDate: attempt.date,
        userId: attempt.userId
      },
      performanceSummary,
      detailedReview: reviewData
    });

  } catch (error) {
    console.error("Results Fetch Error:", {
      user: req.user?.id,
      paperId: req.params?.paperId,
      error: error.message
    });
    return res.status(500).json({
      error: "Failed to retrieve exam results. Please try again later."
    });
  }
};
