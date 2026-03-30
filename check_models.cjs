const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function getApiKey() {
    try {
        const envPath = path.join(__dirname, ".env");
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, "utf8");
            const match = content.match(/VITE_GEMINI_API_KEY=(.*)/);
            if (match) return match[1].trim();
        }
    } catch (e) {}
    return null;
}

const API_KEY = getApiKey();

if (!API_KEY) {
    console.error("API_KEY not found in .env");
    process.exit(1);
}

console.log("Using API Key:", API_KEY.substring(0, 10) + "...");
const genAI = new GoogleGenerativeAI(API_KEY);

async function check() {
    try {
        const result = await genAI.listModels();
        console.log("AVAILABLE MODELS FOR YOUR KEY:");
        result.models.forEach(m => {
            console.log(` - ${m.name}`);
        });
    } catch (e) {
        console.error("ERROR LISTING MODELS:", e.message);
        if (e.message.includes("403")) console.log("HINT: This usually means the API key is restricted or invalid.");
        if (e.message.includes("404")) console.log("HINT: This is very strange for a listModels call.");
    }
}

check();
