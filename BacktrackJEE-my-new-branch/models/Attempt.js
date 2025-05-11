import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  paperId: { type: String, required: true },
  date: { type: Date, required: true },
  
  // Store answers as { [questionId]: selectedOption }
  answers: {
    type: Object,
    required: true
  },

  // Per-question timing analytics
  questionTimings: [
    {
      questionId: { type: Number, required: true },
      timeSpent: { type: Number, required: true }, // seconds
      answeredAt: { type: Date }
    }
  ],

  // Total time spent on the paper
  timeSpent: { type: Number, required: true },

  // Scoring summary
  score: { type: Number, required: true },
  maxPossibleScore: { type: Number, required: true },

  // Performance metrics
  performance: {
    totalQuestions: { type: Number },
    correct: { type: Number },
    incorrect: { type: Number },
    unattempted: { type: Number },
    accuracy: { type: Number },
    timeTaken: { type: Number }
  },

  // Question-wise analysis
  questionAnalysis: [{
    questionId: { type: Number, required: true },
    questionText: { type: String, required: true },
    userAnswer: { type: Number },
    correctAnswer: { type: Number, required: true },
    status: { type: String, enum: ['correct', 'incorrect', 'unattempted'] },
    timeSpent: { type: Number }
  }],

  // Marked questions for review/flagging
  markedQuestions: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

// Enforce one attempt per user per paper
attemptSchema.index({ userId: 1, paperId: 1 }, { unique: true });

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt; 