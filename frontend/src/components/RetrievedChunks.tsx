import React from 'react';
import { Chunk } from '../types';
import './RetrievedChunks.css';

interface RetrievedChunksProps {
  chunks: Chunk[];
  useReranker: boolean;
}

const RetrievedChunks: React.FC<RetrievedChunksProps> = ({ chunks, useReranker }) => {
  const sortedChunks = React.useMemo(() => {
    if (useReranker) {
      return [...chunks].sort((a, b) => (b.rerankerScore ?? 0) - (a.rerankerScore ?? 0));
    }
    return [...chunks].sort((a, b) => b.vectorScore - a.vectorScore);
  }, [chunks, useReranker]);

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div className="retrieved-chunks">
      <div className="chunks-header">
        <h2>Retrieved Chunks</h2>
        <span className="chunks-count">{chunks.length} results</span>
      </div>
      <div className="chunks-list">
        {sortedChunks.map((chunk, index) => (
          <div key={chunk.id} className="chunk-item">
            <div className="chunk-meta">
              <span className="chunk-rank">{index + 1}</span>
              <span className="chunk-source">{chunk.source}</span>
              <div className="chunk-scores">
                <div className="score">
                  <span className="score-label">Vector</span>
                  <span className="score-value">{chunk.vectorScore.toFixed(2)}</span>
                </div>
                {useReranker && chunk.rerankerScore !== undefined && (
                  <div className="score reranker">
                    <span className="score-label">Reranker</span>
                    <span className="score-value">{chunk.rerankerScore.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="chunk-content">{chunk.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetrievedChunks;
