import React, { useState } from "react";
import data from "./data/questions.json";
import "./app.css";

function App() {
  const [answers, setAnswers] = useState({});

  const handleChange = (key, value) => {
    setAnswers({
      ...answers,
      [key]: value,
    });
  };

  return (
    <div className="container">
      <h1 className="title">Personal Development Plan</h1>

      {data.questions.map((section) => (
        <div key={section.section} className="section">
          <h2 className="section-title">{section.section}</h2>

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
                  rows="4"
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
      ))}

      <button className="submit-btn">Submit</button>
    </div>
  );
}

export default App;