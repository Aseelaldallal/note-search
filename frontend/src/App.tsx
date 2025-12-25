import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import RetrievedChunks from './components/RetrievedChunks';
import LLMPrompt from './components/LLMPrompt';
import LLMAnswer from './components/LLMAnswer';
import DebugSection from './components/DebugSection';
import UploadModal from './components/UploadModal';
import SearchingIndicator from './components/SearchingIndicator';
import { SearchResultChunk } from '../../shared/types';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [useReranker, setUseReranker] = useState(false);
  const [chunks, setChunks] = useState<SearchResultChunk[]>([]);
  const [llmPrompt, setLlmPrompt] = useState('');
  const [llmAnswer, setLlmAnswer] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDuration, setSearchDuration] = useState<number | null>(null);
  const [contextChunksCount, setContextChunksCount] = useState<number>(0);
  const isInitialMount = useRef(true);

  // Re-search when reranker toggle changes (after initial search)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (hasSearched && query.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useReranker]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    const startTime = Date.now();
    try {
      const response = await fetch('http://localhost:5001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, useReranker }),
      });

      const data = await response.json();
      console.log('Search response:', data);

      setSearchDuration(Date.now() - startTime);
      setChunks(data.chunks);
      setLlmPrompt(data.prompt);
      setLlmAnswer(data.answer);
      setContextChunksCount(data.contextChunksCount);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
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
            isSearching={isSearching}
          />

          {isSearching && <SearchingIndicator />}

          {hasSearched && !isSearching && (
            <>
              <LLMAnswer answer={llmAnswer} />
              <DebugSection duration={searchDuration}>
                <RetrievedChunks chunks={chunks} useReranker={useReranker} />
                <LLMPrompt prompt={llmPrompt} contextChunksCount={contextChunksCount} />
              </DebugSection>
            </>
          )}
        </div>
      </main>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
