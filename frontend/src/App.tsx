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

  const handleSearch = () => {
    if (!query.trim()) return;

    // Stub: use mock data for now
    setChunks(mockChunks);
    setLlmPrompt(mockLLMPrompt);
    setLlmAnswer(mockLLMAnswer);
    setHasSearched(true);
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
