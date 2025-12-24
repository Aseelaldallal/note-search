import React from 'react';
import './SearchingIndicator.css';

const SearchingIndicator: React.FC = () => {
  return (
    <div className="searching-indicator">
      <div className="searching-content">
        <div className="searching-spinner">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            />
          </svg>
        </div>
        <div className="searching-text">
          <span className="searching-title">Searching your documents</span>
          <span className="searching-subtitle">Finding relevant information...</span>
        </div>
      </div>
      <div className="searching-skeleton">
        <div className="skeleton-line skeleton-line-1"></div>
        <div className="skeleton-line skeleton-line-2"></div>
        <div className="skeleton-line skeleton-line-3"></div>
      </div>
    </div>
  );
};

export default SearchingIndicator;
