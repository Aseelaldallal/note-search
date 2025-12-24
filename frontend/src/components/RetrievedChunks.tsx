import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Chunk } from '../types';
import './RetrievedChunks.css';

interface RetrievedChunksProps {
  chunks: Chunk[];
  useReranker: boolean;
}

const TRUNCATE_LENGTH = 100;

const RetrievedChunks: React.FC<RetrievedChunksProps> = ({ chunks }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const sortedChunks = React.useMemo(() => {
    return [...chunks].sort((a, b) => b.similarity - a.similarity);
  }, [chunks]);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const truncateContent = (content: string) => {
    if (content.length <= TRUNCATE_LENGTH) return content;
    return content.substring(0, TRUNCATE_LENGTH) + '...';
  };

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div className="retrieved-chunks">
      <button
        className="chunks-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        <h2>Retrieved Chunks</h2>
        <div className="chunks-header-right">
          <span className="chunks-count">{chunks.length} results</span>
          <svg
            className={`chevron ${!isCollapsed ? 'expanded' : ''}`}
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
        </div>
      </button>
      <div className={`chunks-list ${!isCollapsed ? 'expanded' : ''}`}>
        {sortedChunks.map((chunk, index) => {
          const isExpanded = expandedIds.has(chunk.id);
          return (
            <div
              key={chunk.id}
              className={`chunk-item ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleExpand(chunk.id)}
            >
              <div className="chunk-meta">
                <span className="chunk-rank">{index + 1}</span>
                <span className="chunk-source">{chunk.sourceFilename}</span>
                <div className="chunk-scores">
                  <div className="score">
                    <span className="score-label">VECTOR</span>
                    <span className="score-value">{chunk.similarity.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="chunk-content">
                <ReactMarkdown
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
                  {isExpanded ? chunk.content : truncateContent(chunk.content)}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RetrievedChunks;
