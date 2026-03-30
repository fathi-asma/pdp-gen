import React, { useState } from "react";
import data from "./data/questions.json";
import { generatePDP } from "./services/aiService";
import ReactMarkdown from "react-markdown";
import "./app.css";

function App() {
  const [answers, setAnswers] = useState({
    "1": "Senuda Dil",
    "2": "20",
    "3": "Colombo, Sri Lanka",
    "4": "BSc in IT at SLIIT (in progress)",
    "5": "Introverted, analytical, calm, and highly focused on growth.",
    "6": "Integrity, continuous learning, and contributing to the community.",
    "7": "Through hands-on projects, technical blogs, and YouTube tutorials.",
    "8": "Obtain a high-quality internship in full-stack development by next year.",
    "9": "Become a senior software engineer specializing in AI and distributed systems.",
    "10": "Full-stack developer / AI Engineer",
    "11": "Java, Python, React, problem-solving, and system design.",
    "12": "Communication skills, backend architecture, and time management.",
    "13": "Built a comprehensive vehicle management system and a PDP generator.",
    "14": "Balancing academic work with personal projects and business handling.",
    "15": "Limited mentorship opportunities in the local tech scene.",
    "16": "University mentors, tech communities, and peer groups.",
    "17": "1 year",
    "18": "Focus on tech stacks, soft skills, and personal finance."
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setAnswers({
      ...answers,
      [key]: value,
    });
  };

  const fillTestData = () => {
    setAnswers({
      "1": "John Doe",
      "2": "25",
      "3": "London, UK",
      "4": "BSc in Computer Science (Graduate)",
      "5": "Extroverted, team player, creative, and proactive.",
      "6": "Innovation, transparency, and social responsibility.",
      "7": "Group discussions, interactive courses, and building prototypes.",
      "8": "Securing a junior developer role in a fintech company.",
      "9": "Leading a product development team in a global tech firm.",
      "10": "Frontend Developer",
      "11": "JavaScript, TypeScript, CSS, UI/UX design.",
      "12": "Public speaking, Node.js, and data structures.",
      "13": "Redesigned a non-profit website; built a task manager app.",
      "14": "Finding the right balance between speed and code quality.",
      "15": "Fast-paced changes in the frontend landscape.",
      "16": "Online tech forums, local meetups, and family.",
      "17": "2 years",
      "18": "Advanced React patterns, leadership skills, and fitness."
    });
  };

  const handleSubmit = async () => {
    // Check if at least some answers are provided
    if (Object.keys(answers).length === 0) {
      setError("Please fill in at least some details before submitting.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      // Map user answers for the AI service
      const userResponses = {};
      data.questions.forEach((section) => {
        section.items.forEach((item) => {
          if (answers[item.id]) {
            userResponses[item.question] = answers[item.id];
          }
        });
      });

      const response = await generatePDP(userResponses);
      setResult(response);
      
      // Scroll to result after a short delay to allow rendering
      setTimeout(() => {
        document.getElementById("pdp-result")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate your plan. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">AI PDP Generator</h1>
        <p className="subtitle">Answer a few questions and let AI craft your Personal Development Plan.</p>
      </header>

      <div className="form-container">
        {data.questions.map((section) => (
          <div key={section.section} className="section shadow-hover">
            <h2 className="section-title">{section.section}</h2>

            <div className="section-grid">
              {section.items.map((item) => (
                <div key={item.id} className="form-group">
                  <label>{item.question}</label>

                  {item.type === "input" ? (
                    <input
                      type="text"
                      placeholder={item.placeholder}
                      value={answers[item.id] || ""}
                      onChange={(e) =>
                        handleChange(item.id, e.target.value)
                      }
                    />
                  ) : (
                    <textarea
                      rows="3"
                      placeholder={item.placeholder}
                      value={answers[item.id] || ""}
                      onChange={(e) =>
                        handleChange(item.id, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="actions">
        <div className="test-controls">
          <button className="secondary-btn" onClick={fillTestData}>Load Another Sample</button>
          <button className="secondary-btn" onClick={() => setAnswers({})}>Clear All</button>
        </div>
        <button 
          className={`submit-btn ${isLoading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loader-box">
              <span className="spinner"></span>
              Generating...
            </span>
          ) : (
             "Generate My Plan"
          )}
        </button>
      </div>

      {result && (
        <div id="pdp-result" className="result-container fadeIn">
          <div className="result-header">
            <h2>Your Personal Development Plan</h2>
            <button className="print-btn" onClick={() => window.print()}>Print / Save as PDF</button>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;