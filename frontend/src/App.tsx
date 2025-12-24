import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import RetrievedChunks from './components/RetrievedChunks';
import LLMPrompt from './components/LLMPrompt';
import LLMAnswer from './components/LLMAnswer';
import UploadModal from './components/UploadModal';
import { Chunk } from './types';
import { mockChunks, mockLLMPrompt, mockLLMAnswer } from './mockData';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [useReranker, setUseReranker] = useState(false);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [llmPrompt, setLlmPrompt] = useState('');
  const [llmAnswer, setLlmAnswer] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log('Search response:', data);

      // TODO: Update state with actual response data once backend returns it
      // For now, still using mock data for display
      setChunks(mockChunks);
      setLlmPrompt(mockLLMPrompt);
      setLlmAnswer(mockLLMAnswer);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="app">
      <Header onUploadClick={() => setIsModalOpen(true)} />

      <main className="main-content">
        <div className="content-container">
          <SearchSection
            query={query}
            onQueryChange={setQuery}
            useReranker={useReranker}
            onRerankerChange={setUseReranker}
            onSearch={handleSearch}
          />

          {hasSearched && (
            <>
              <RetrievedChunks chunks={chunks} useReranker={useReranker} />
              <LLMPrompt prompt={llmPrompt} />
              <LLMAnswer answer={llmAnswer} />
            </>
          )}
        </div>
      </main>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
