import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
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
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    paid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // ✅ Auto-adds `createdAt` & `updatedAt`
});

// ✅ Prevent duplicate model definition
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
