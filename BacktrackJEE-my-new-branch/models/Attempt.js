import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // ID of the user
  user_name: { type: String, required: true }, // Name of the user
  year: { type: String, required: true }, // Exam year
  slot: { type: String, required: true }, // Exam slot
  
  // correctOptions should be an array of objects, each containing question_id and selected_correctOption
  correctOptions: [
    {
      question_id: { type: Number }, // ID of the question
      selected_correctOption: { type: Number }, // User's selected correctOption
    },
  ],

  // Map of marked questions for review, stored dynamically with question_id as the key
  markedQuestions: { 
    type: Map, 
    of: String, // Values like "reviewedWithcorrectOption" or "reviewedWithoutcorrectOption"
    default: {}  // Default empty object if no questions are marked
  },

  // Timestamps to track when the attempt was created and last updated
}, { timestamps: true });

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;