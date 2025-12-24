import React, { useState } from 'react';
import './DebugSection.css';

interface DebugSectionProps {
  children: React.ReactNode;
  duration?: number | null;
}

const DebugSection: React.FC<DebugSectionProps> = ({ children, duration }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="debug-section">
      <button
        className="debug-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="debug-header-left">
          <div className="debug-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C10.3431 2 9 3.34315 9 5V6H15V5C15 3.34315 13.6569 2 12 2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 14V12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12V14"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 10H8M16 10H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 14H8M16 14H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 18L8 16M18 18L16 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="8"
                y="12"
                width="8"
                height="8"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="debug-title">Debug Info</span>
          <span className="debug-badge">Developer</span>
          {duration !== null && duration !== undefined && (
            <span className="debug-duration">{duration}ms</span>
          )}
        </div>
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
      <div className={`debug-content ${isExpanded ? 'expanded' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DebugSection;
