import Attempt from "../models/Attempt.js";

export const checkExistingAttempt = async (req, res, next) => {
  try {
    const { paperId } = req.body;
    const userId = req.user.id;

    if (!paperId) {
      return res.status(400).json({
        error: "paperId is required",
        solution: "Please provide a paperId in the request body"
      });
    }

    const existingAttempt = await Attempt.findOne({ userId, paperId });
    if (existingAttempt) {
      return res.status(409).json({
        error: "Attempt already exists",
        message: "You have already attempted this paper",
        existingId: existingAttempt._id,
        solution: "You can view your previous attempt instead"
      });
    }

    next();
  } catch (error) {
    console.error("Attempt Check Error:", error);
    res.status(500).json({
      error: "Failed to check attempt status",
      solution: "Please try again later"
    });
  }
}; 