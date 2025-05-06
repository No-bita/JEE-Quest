import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    paid: {
        type: Boolean,
        default: false
    },
    purchasedPapers: [{
        type: String, // paperId
        default: []
    }]
}, {
    timestamps: true // ✅ Auto-adds `createdAt` & `updatedAt`
});

// ✅ Prevent duplicate model definition
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
