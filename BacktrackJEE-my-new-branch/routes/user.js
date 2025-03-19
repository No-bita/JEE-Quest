import express from "express";
import User from "../models/user.js"; // ✅ Add `.js` extension in imports
import authenticateUser  from "../middleware/authmiddleware.js"; // ✅ Ensure file extension

const router = express.Router();

// ✅ Fetch User Details (Protected Route)
router.get("/profile", authenticateUser, async (req, res, next) => {
    try {
        console.log("Fetching user profile...");
        console.log("User ID:", req.user.id);
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user });
    } catch (error) {
        next(error);
    }
});

// ✅ Error handling middleware
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
});

export default router; // ✅ Use ES Modules export
