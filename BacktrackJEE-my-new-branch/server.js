import express from "express";
// import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // ✅ Import database connection
import path from 'path';
import { fileURLToPath } from 'url';


// ✅ Load environment variables
dotenv.config();

// ✅ Validate environment variables before running
if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env");
    process.exit(1);
}
if (!process.env.CLIENT_URL) {
    console.error("❌ CLIENT_URL is missing in .env");
    process.exit(1);
}

// Initialize app
const app = express();

// ✅ CORS Configuration
app.use(cors({
    origin: [
        "https://jee-quest.vercel.app",
        "http://localhost:8080",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Security headers
app.use((req, res, next) => {
    res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
});

// ✅ Trust first proxy (needed for cookies)
app.set("trust proxy", 1);

// ✅ Routes
import authRoutes from "./routes/auth.js";
import attemptsRoutes from "./routes/attempts.js";
import questionsRoutes from "./routes/questions.js";
import resultsRoutes from "./routes/results.js";
import userRoutes from "./routes/user.js";

import dashboardRouter from "./routes/dashboard.js";

app.use("/api/auth", authRoutes);
app.use("/api", attemptsRoutes);
app.use("/api/papers", questionsRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/user", userRoutes);

app.use("/api", dashboardRouter);

// Serve robots.txt and sitemap.xml
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
  });
  
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
  });
  

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Operational errors (e.g., validation errors) can have detailed messages
    if (err.isOperational) {
        res.status(400).json({ message: err.message });
    } else {
        // System errors (e.g., DB connection errors) can be more generic
        res.status(500).json({
            message: "Something went wrong!",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
});

// ✅ 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ✅ Start Server Only After MongoDB is Connected
const PORT = process.env.PORT || 5001;
const startServer = async () => {
    try {
        await connectDB(); // ✅ Ensure DB connection before running server

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1); // Stop process if DB fails
    }
};

startServer(); // ✅ Start server only if MongoDB connects successfully

export default app;
