import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Reference to User._id
  userName: { type: String, required: true }, // For quick lookup/reporting
  paperId: { type: String, required: true }, // Reference to Paper.paperId
  year: { type: Number, required: true },
  session: { type: String, required: true },
  shift: { type: String, required: true },
  date: { type: String, required: true },

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
      answeredAt: { type: Date } // optional
    }
  ],

  // Total time spent on the paper
  timeSpent: { type: Number, required: true },

  // Scoring summary (optional, if you want to store it here)
  score: { type: Number },
  maxPossibleScore: { type: Number },

  // Marked questions (optional, for review/flagging features)
  markedQuestions: {
    type: Object, // { [questionId]: "reviewed" | "flagged" | ... }
    default: {}
  }
}, { timestamps: true });

// Enforce one attempt per user per paper
attemptSchema.index({ userId: 1, paperId: 1 }, { unique: true });

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;