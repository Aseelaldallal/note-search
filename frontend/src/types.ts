export interface Chunk {
  id: number;
  sourceFilename: string;
  content: string;
  similarity: number;
}

export interface SearchState {
  query: string;
  useReranker: boolean;
  chunks: Chunk[];
  llmPrompt: string;
  llmAnswer: string;
  hasSearched: boolean;
}
