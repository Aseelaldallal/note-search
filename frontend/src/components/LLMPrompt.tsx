import React, { useState } from 'react';
import './LLMPrompt.css';

interface LLMPromptProps {
  prompt: string;
}

const LLMPrompt: React.FC<LLMPromptProps> = ({ prompt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!prompt) {
    return null;
  }

  return (
    <div className="llm-prompt">
      <button
        className="prompt-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h2>LLM Prompt</h2>
        <svg
          className={`chevron ${isExpanded ? 'expanded' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`prompt-content ${isExpanded ? 'expanded' : ''}`}>
        <pre>{prompt}</pre>
      </div>
    </div>
  );
};

export default LLMPrompt;
