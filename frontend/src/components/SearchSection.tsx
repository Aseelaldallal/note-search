import React from 'react';
import Toggle from './Toggle';
import './SearchSection.css';

interface SearchSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  useReranker: boolean;
  onRerankerChange: (useReranker: boolean) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  onQueryChange,
  useReranker,
  onRerankerChange,
  onSearch,
  isSearching,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h2>Your Question</h2>
        <Toggle
          label="Use Reranker"
          checked={useReranker}
          onChange={onRerankerChange}
        />
      </div>
      <div className="search-input-row">
        <input
          type="text"
          className="search-input"
          placeholder="Ask a question about your documents..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="search-button"
          onClick={onSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <svg
              className="spinner"
              width="16"
              height="16"
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
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
