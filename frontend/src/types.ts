import type { SearchResultChunk } from '../../shared/types';

export interface SearchState {
  query: string;
  useReranker: boolean;
  chunks: SearchResultChunk[];
  llmPrompt: string;
  llmAnswer: string;
  hasSearched: boolean;
}
