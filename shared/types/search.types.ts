export interface SearchResultChunk {
  id: number;
  sourceFilename: string;
  content: string;
  vectorScore: number;
  rerankerScore?: number;
}

export interface SearchResult {
  answer: string;
  chunks: SearchResultChunk[];
  prompt: string;
  contextChunksCount: number;
}
