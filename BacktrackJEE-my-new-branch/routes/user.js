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

// --- Single Paper Access Endpoints ---
import Mapping from '../models/Mapping.js';

// 1. Purchase a single paper
router.post('/papers/:paperId/purchase', authenticateUser, async (req, res) => {
    const { paperId } = req.params;
    try {
        // Check if paper exists
        const mapping = await Mapping.findOne({ paperId });
        if (!mapping) {
            return res.status(404).json({ success: false, message: 'Paper not found.' });
        }
        // Add paperId to user's purchasedPapers if not already present
        const user = await User.findById(req.user.id);
        if (!user.purchasedPapers.includes(paperId)) {
            user.purchasedPapers.push(paperId);
            await user.save();
        }
        res.json({ success: true, message: 'Paper purchased successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// 2. Check if user has access to a paper
router.get('/papers/:paperId/access', authenticateUser, async (req, res) => {
    const { paperId } = req.params;
    try {
        const user = await User.findById(req.user.id);
        const hasAccess = (user.purchasedPapers && user.purchasedPapers.includes(paperId));
        res.json({ success: true, access: hasAccess });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// 3. List all purchased papers for the user
router.get('/papers/purchased', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, purchasedPapers: user.purchasedPapers || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

export default router; // ✅ Use ES Modules export
