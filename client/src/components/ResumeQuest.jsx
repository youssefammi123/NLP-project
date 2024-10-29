import React, { useState } from 'react';
import './QuestionGeneration.css';
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const ResumeQuest = () => {
  const [resumeText, setResumeText] = useState('');
  const [category, setCategory] = useState('Data Science');
  const [questions, setQuestions] = useState([]);

  const handleGenerateQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume_text: resumeText, category }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const cleanedQuestions = data.questions.map(question => ({
        ...question,
        text: question.text.replace(/^\d+\.\s*-?\s*/, '').trim(),
      }));
      setQuestions(cleanedQuestions || []);
    } catch (error) {
      console.error('Error generating questions:', error);
    }
  };

  return (
    <div className="questiongeneration-container">
      <div className="questiongeneration-input-section">
        <label htmlFor="resume-text" className="questiongeneration-label">Resume Text</label>
        <textarea
          id="resume-text"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume here..."
          rows={4}
          className="questiongeneration-textarea"
        />
      </div>
      <div className="questiongeneration-category-section">
        <FormControl sx={{ width: 300, height: 50 }} className="custom-form-control">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            sx={{ height: 50 }}  // Maintain height for Select
          >
            <MenuItem value="Data Science">Data Science</MenuItem>
            <MenuItem value="Software Engineering">Software Engineering</MenuItem>
            <MenuItem value="Product Management">Product Management</MenuItem>
            <MenuItem value="Data Analyst">Data Analyst</MenuItem>
            <MenuItem value="Full Stack">Full Stack</MenuItem>
            <MenuItem value="Front End Developer">Front End Developer</MenuItem>
            <MenuItem value="Back End Developer">Back End Developer</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button
        variant="contained"
        color="primary"
        className="questiongeneration-generate-button"
        onClick={handleGenerateQuestions}
      >
        Generate Interview Questions
      </Button>
      <div className="questiongeneration-questions-section">
        <h2 className="questiongeneration-title">Interview Questions</h2>
        {questions.length === 0 ? (
          <p>No questions generated yet.</p>
        ) : (
          questions.map((question, index) => {
            const difficulty = question.difficulty ? question.difficulty.toLowerCase() : 'unknown';
            return (
              <div key={index} className="questiongeneration-question-item">
                <div className={`questiongeneration-badge ${difficulty}`}>
                  {question.difficulty || 'Unknown'}
                </div>
                <div className="questiongeneration-question-content">
                  <h3 className="questiongeneration-question-title">{question.text}</h3>
                  <p className="questiongeneration-question-description">{question.category}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResumeQuest;
