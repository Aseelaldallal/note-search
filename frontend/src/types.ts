export interface Chunk {
  id: number;
  rank: number;
  source: string;
  content: string;
  vectorScore: number;
  rerankerScore?: number;
}

export interface SearchState {
  query: string;
  useReranker: boolean;
  chunks: Chunk[];
  llmPrompt: string;
  llmAnswer: string;
  hasSearched: boolean;
}
