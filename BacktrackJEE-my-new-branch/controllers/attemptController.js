import Attempt from "../models/Attempt.js";
import mongoose from "mongoose";

// Save a new attempt with results (POST /api/attempts/save)
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

    // Calculate performance metrics
    const QuestionModel = mongoose.models[paperId] || 
      mongoose.model(paperId, new mongoose.Schema({
        question_id: Number,
        type: String,
        question_text: String,
        options: Object,
        correct_option: Number,
        imageUrl: String
      }), paperId);

    const questions = await QuestionModel.find({});
    
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const questionAnalysis = [];

    for (const question of questions) {
      const userAnswer = answers[question._id] ?? null;
      const isCorrect = userAnswer === question.correct_option;

      let status;
      if (userAnswer === null) {
        unattempted++;
        status = "unattempted";
      } else if (isCorrect) {
        correct++;
        status = "correct";
      } else {
        incorrect++;
        status = "incorrect";
      }

      questionAnalysis.push({
        questionId: question._id,
        questionText: question.question_text,
        userAnswer,
        correctAnswer: question.correct_option,
        status,
        timeSpent: questionTimings.find(t => t.questionId === question._id)?.timeSpent || 0
      });
    }

    const accuracy = ((correct / (correct + incorrect)) * 100).toFixed(1);

    // const newAttempt = new Attempt({
    //   userId,
    //   userName,
    //   paperId,
    //   answers: answers.map(answer => ({
    //     ...answer,
    //     timestamp: new Date()
    //   })),
    //   questionTimings,
    //   timeSpent,
    //   score,
    //   maxPossibleScore,
    //   date: new Date(),
    //   performance: {
    //     totalQuestions: questions.length,
    //     correct,
    //     incorrect,
    //     unattempted,
    //     accuracy,
    //     timeTaken: timeSpent
    //   },
    //   questionAnalysis
    // });

    await newAttempt.save();

    return res.status(201).json({
      success: true,
      attemptId: newAttempt._id,
      score: newAttempt.score,
      performance: newAttempt.performance,
      questionAnalysis: newAttempt.questionAnalysis
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
    }).select("_id score performance createdAt");

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

// Get attempt details with results (GET /api/attempts/:paperId)
export const getAttemptDetails = async (req, res) => {
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

    return res.status(200).json({
      meta: {
        paperId: attempt.paperId,
        attemptDate: attempt.date,
        userId: attempt.userId
      },
      performance: attempt.performance,
      questionAnalysis: attempt.questionAnalysis,
      timeSpent: attempt.timeSpent,
      markedQuestions: attempt.markedQuestions
    });

  } catch (error) {
    console.error("Attempt Details Fetch Error:", {
      user: req.user?.id,
      paperId: req.params?.paperId,
      error: error.message
    });
    return res.status(500).json({
      error: "Failed to retrieve attempt details. Please try again later."
    });
  }
};

// Get user's all attempts (GET /api/attempts/user)
export const getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;

    const attempts = await Attempt.find({ userId })
      .select('paperId date score maxPossibleScore performance')
      .sort({ date: -1 });

    return res.json({
      success: true,
      attempts: attempts.map(attempt => ({
        paperId: attempt.paperId,
        date: attempt.date,
        score: attempt.score,
        maxPossibleScore: attempt.maxPossibleScore,
        performance: attempt.performance
      }))
    });

  } catch (error) {
    console.error("Error fetching user attempts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
