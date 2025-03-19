import Attempt from "../models/Attempt.js";
import mongoose from "mongoose";

// 🧠 Calculate Results
export const calculateResults = async (req, res) => {
    const { user_id, year, slot } = req.query;

    if (!user_id || !year || !slot) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        // 🔍 Step 1: Fetch User Attempt
        const attempt = await Attempt.findOne({ user_id, year, slot });
        if (!attempt) {
            return res.status(404).json({ error: "Attempt not found" });
        }

        // 🔍 Step 2: Fetch Questions Collection
        const slotFormatted = slot.replace(/\s+/g, "_");
        const QuestionModel = mongoose.models[slotFormatted] || 
            mongoose.model(slotFormatted, new mongoose.Schema({
                question_id: Number,
                type: String,
                question_text: String,
                options: Object,
                correct_option: Number,
                imageUrl: String
            }), slotFormatted);

        const questions = await QuestionModel.find({});

        // 🔍 Step 3: Calculate Results
        let correct = 0;
        let incorrect = 0;
        let unattempted = 0;
        const correctOptionsDetails = [];

        for (const question of questions) {
            const usercorrectOption = attempt.correctOptions[question._id] ?? null;
            const isCorrect = usercorrectOption === question.correct_option;

            let status;
            if (usercorrectOption === null) {
                unattempted++;
                status = "unattempted";
            } else if (isCorrect) {
                correct++;
                status = "correct";
            } else {
                incorrect++;
                status = "incorrect";
            }

            correctOptionsDetails.push({
                question_text: question.question_text,
                user_correctOption: usercorrectOption,
                correct_correctOption: question.correct_option,
                status
            });
        }

        // 🔍 Step 4: Calculate Marks
        const totalMarks = correct * 4 - incorrect;

        // 🛠️ Step 5: Send Response
        res.json({
            total_questions: questions.length,
            correct,
            incorrect,
            unattempted,
            total_marks: totalMarks,
            correctOptions: correctOptionsDetails
        });

    } catch (error) {
        console.error("Error calculating results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
