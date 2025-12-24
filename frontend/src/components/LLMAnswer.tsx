import React from 'react';
import './LLMAnswer.css';

interface LLMAnswerProps {
  answer: string;
}

const LLMAnswer: React.FC<LLMAnswerProps> = ({ answer }) => {
  if (!answer) {
    return null;
  }

  return (
    <div className="llm-answer">
      <div className="answer-header">
        <div className="answer-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 3L4 14H12L11 21L20 10H12L13 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>LLM Answer</h2>
      </div>
      <p className="answer-content">{answer}</p>
    </div>
  );
};

export default LLMAnswer;
