import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import getQuestionModel from "./models/Question.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Get JSON file path and extract collection name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.resolve(__dirname, "JEE Mains/2025_Jan_24_Shift_1.json");
const collectionName = path.basename(jsonFilePath, ".json");

// ✅ Fix: Use Correct MONGODB_URI with Explicit Database Name
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in .env file!");
    process.exit(1);
}

// ✅ Connect to MongoDB with the Correct Database
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "Mains",
        });
        console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// ✅ Function to Load JSON and Push to MongoDB
const pushJSONToMongo = async () => {
    try {
        // ✅ Connect to MongoDB
        await connectDB();

        // ✅ Get the correct Question model dynamically (based on filename)
        const Paper = await getQuestionModel(collectionName);

        // ✅ Delete all existing documents before inserting new ones
        await Paper.deleteMany({});
        console.log(`🗑️ Cleared previous data from ${collectionName}`);

        // ✅ Read JSON data
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
        
        // Print structure to debug
        console.log("Paper structure:", JSON.stringify(jsonData[0], null, 2).substring(0, 500) + "...");
        
        // ✅ Insert the paper document directly
        // The JSON is an array with one object, so we insert the first element
        await Paper.create(jsonData[0]);
        console.log(`✅ Successfully inserted paper with ${jsonData[0].questions.length} questions into MongoDB collection: ${collectionName}`);

    } catch (error) {
        console.error("❌ Error inserting JSON data into MongoDB:", error);
    } finally {
        // ✅ Close connection only after all operations complete
        await mongoose.connection.close();
        console.log("🔌 MongoDB Connection Closed");
    }
};

// ✅ Run the Function
pushJSONToMongo();
