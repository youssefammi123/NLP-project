import React, { useState } from 'react';
import './QuestionGeneration.css';

const QuestionGeneration = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [questions, setQuestions] = useState([]);

    const generateQuestions = async () => {
        const response = await fetch('/generate-job-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ job_description: jobDescription }),
        });
        const data = await response.json();
        setQuestions(data.questions);
    };

    return (
        <div className="questiongeneration-container">
            <div className="questiongeneration-input-section">
                <label htmlFor="job-description" className="questiongeneration-label">Job Description</label>
                <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter the job description here..."
                    rows={4}
                    className="questiongeneration-textarea"
                />
            </div>
            <button className="questiongeneration-generate-button" onClick={generateQuestions}>
                Generate Interview Questions
            </button>
            <div className="questiongeneration-questions-section">
                <h2 className="questiongeneration-title">Interview Questions</h2>
                {questions.map((question, index) => {
                    const difficulty = question[2] ? question[1].toLowerCase() : 'unknown';
                    return (
                        <div key={index} className="questiongeneration-question-item">
                            <div className={`questiongeneration-badge ${difficulty}`}>
                                {question[1] || 'Unknown'}
                            </div>
                            <div className="questiongeneration-question-content">
                                <h3 className="questiongeneration-question-title">{question[0]}</h3>
                                <p className="questiongeneration-question-description">{question[2]}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionGeneration;
