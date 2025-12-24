import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
        <div className="prompt-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && !className;

                return isInline ? (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match ? match[1] : 'text'}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {prompt}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default LLMPrompt;
