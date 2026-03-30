import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Info, ChevronDown, Check, Bot } from "lucide-react";
import data from "../data/questions.json";

const getProviderLogo = (modelId) => {
  if (!modelId) return null;
  const id = modelId.toLowerCase();
  
  if (id.includes('google') || id.includes('gemma')) return "https://api.iconify.design/logos:google-icon.svg";
  if (id.includes('meta') || id.includes('llama')) return "https://api.iconify.design/logos:meta-icon.svg";
  if (id.includes('openai') || id.includes('gpt')) return "https://api.iconify.design/logos:openai-icon.svg";
  if (id.includes('mistral') || id.includes('mixtral')) return "https://api.iconify.design/logos:mistral-icon.svg";
  if (id.includes('anthropic') || id.includes('claude')) return "https://api.iconify.design/logos:anthropic-icon.svg";
  if (id.includes('cohere')) return "https://api.iconify.design/logos:cohere-icon.svg";
  if (id.includes('huggingface')) return "https://api.iconify.design/logos:huggingface-icon.svg";
  
  // Custom precise icons
  if (id.includes('qwen')) return "https://qianwen-res.oss-cn-beijing.aliyuncs.com/logo_qwen.svg";
  if (id.includes('deepseek')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/DeepSeek_logo.svg/512px-DeepSeek_logo.svg.png";
  if (id.includes('microsoft')) return "https://api.iconify.design/logos:microsoft-icon.svg";
  if (id.includes('x-ai') || id.includes('grok')) return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/512px-X_logo_2023.svg.png";

  return null; // Signals we should use the Lucide Bot fallback
};

function FormPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    "1": "Kamal",
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
    "18": "Focus on tech stacks, soft skills, and personal finance.",
    "19": "it241000000",
    "20": "Specializing in Data Science",
    "21": "32 33 19",
    "22": "2",
    "23": "Actively engaged in personal web development projects, leading small collaborative teams.",
    "24": "Hands-on experience across frontend and backend development.",
    "25": "Contributed to academic and personal projects spanning web application development.",
    "26": "Ongoing education in Information Technology (BSc in IT at SLIIT) with practical skills in modern web technologies and active participation in peer study groups and mentorship networks.",
    "27": "1 year 2 semester"
  });
  const [error, setError] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash:free");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("https://openrouter.ai/api/v1/models")
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const freeModels = data.data
            .filter(m => m.pricing && m.pricing.prompt === "0" && m.pricing.completion === "0")
            .map(m => ({ id: m.id, name: m.name }));
          setModels(freeModels);
          
          // Only change default if the currently selected one turns out to not be free.
          // Wait, actually Google Gemini 2.5 Flash Free is a great default if it exists.
          const hasDefault = freeModels.some(m => m.id === "google/gemini-2.5-flash:free");
          if (!hasDefault && freeModels.length > 0) {
            setSelectedModel(freeModels[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

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
      "18": "Advanced React patterns, leadership skills, and fitness.",
      "19": "it241000000",
      "20": "Specializing in Data Science",
      "21": "32 33 19",
      "22": "2",
      "23": "Actively engaged in personal web development projects, leading small collaborative teams.",
      "24": "Hands-on experience across frontend and backend development.",
      "25": "Contributed to academic and personal projects spanning web application development.",
      "26": "Ongoing education in Information Technology (BSc in IT at SLIIT) with practical skills in modern web technologies and active participation in peer study groups and mentorship networks.",
      "27": "1 year 2 semester"
    });
  };

  const handleSubmit = () => {
    // Check if at least some answers are provided
    if (Object.keys(answers).length === 0) {
      setError("Please fill in at least some details before submitting.");
      return;
    }
    setError("");

    // Map user answers
    const userResponses = {};
    data.questions.forEach((section) => {
      section.items.forEach((item) => {
        if (answers[item.id]) {
          userResponses[item.question] = answers[item.id];
        }
      });
    });

    navigate("/result", { state: { userAnswers: userResponses, selectedModel } });
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">AI PDP Generator</h1>
        <p className="subtitle">Answer a few questions and let AI craft your Personal Development Plan.</p>
        
        <div className="quota-banner fadeIn">
          <Info size={18} className="info-icon" />
          <p>
            <strong>Api Usage Note:</strong> Some models might not be working right now. 
            If your generation fails, please try selecting a different model from the list. Sorry for the inconvenience!
          </p>
        </div>
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

      <div className="actions" style={{ flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
          <label style={{ fontWeight: 600, color: '#333' }}>Select AI Model for Generation:</label>
          
          <div 
            ref={dropdownRef}
            style={{ position: 'relative', width: '100%' }}
          >
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e0e0e0',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left',
                transition: 'all 0.2s', outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                 {(() => {
                    const activeModelObj = models.find(m => m.id === selectedModel);
                    if (!activeModelObj) {
                       return <><Bot size={20} color="#666" /> <span>Loading free models...</span></>;
                    }
                    const logoUrl = getProviderLogo(activeModelObj.id);
                    return (
                      <>
                        {logoUrl ? (
                          <img src={logoUrl} alt={activeModelObj.name} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                        ) : (
                          <Bot size={20} color="#6c63ff" />
                        )}
                        <span style={{ fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {activeModelObj.name || activeModelObj.id}
                        </span>
                      </>
                    );
                 })()}
              </div>
              <ChevronDown size={18} color="#666" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isDropdownOpen && models.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                background: 'white', borderRadius: '12px', border: '1px solid #e0e0e0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '300px', overflowY: 'auto', zIndex: 20
              }}>
                {models.map(m => {
                  const isSelected = m.id === selectedModel;
                  const logoUrl = getProviderLogo(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m.id);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                        background: isSelected ? '#f8f8ff' : 'transparent', border: 'none', borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s'
                      }}
                      onMouseOver={(e) => {
                         if(!isSelected) e.currentTarget.style.background = '#f5f5f5';
                      }}
                      onMouseOut={(e) => {
                         if(!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {logoUrl ? (
                        <img src={logoUrl} alt={m.name} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                      ) : (
                        <Bot size={20} color={isSelected ? "#6c63ff" : "#666"} />
                      )}
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 500, color: isSelected ? '#6c63ff' : '#333' }}>
                          {m.name || m.id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>
                          {m.id.split(':')[0]}
                        </span>
                      </div>
                      
                      {isSelected && <Check size={18} color="#6c63ff" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="test-controls" style={{ marginTop: '0' }}>
          <button className="secondary-btn" onClick={fillTestData}>Load Another Sample</button>
          <button className="secondary-btn" onClick={() => setAnswers({})}>Clear All</button>
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
        >
          Generate My Plan
        </button>
      </div>
    </div>
  );
}

export default FormPage;
