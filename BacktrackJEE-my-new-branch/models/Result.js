import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    paperId: { type: String, required: true }, // ✅ Store paper ID as Number if numeric
    userId: { type: String, required: true }, // ✅ Store user ID as Number if numeric
    date: { type: Date, required: true }, // ✅ Store date as Date type
    timeSpent: { type: Number, required: true }, // ✅ Store time spent as Number if numeric
    score: { type: Number, required: true },
    maxPossibleScore: { type: Number, required: true },

    answers: {
      type: Object,
      required: true
    },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
export default Result;