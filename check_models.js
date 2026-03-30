import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API key found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function checkModels() {
    try {
        const result = await genAI.listModels();
        console.log("Available models:");
        result.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods})`));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

checkModels();
