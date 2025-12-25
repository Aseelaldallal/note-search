import OpenAI from 'openai';
import { CohereClientV2 } from 'cohere-ai';
import { ChunkerService } from './chunker.service';
import { SearchResultChunk, SearchResult } from '../../../shared/types';

const SIMILARITY_LIMIT = 20;
const LLM_CONTEXT_LIMIT = 10;
const RERANKER_SCORE_THRESHOLD = 0.3;

export class SearchService {
  constructor(
    private readonly chunkerService: ChunkerService,
    private readonly openai: OpenAI,
    private readonly cohere: CohereClientV2
  ) {}

  public async search(query: string, useReranker: boolean): Promise<SearchResult> {
    console.log('Embedding query...', useReranker ? '(reranker enabled)' : '');

    const embedding = await this.embedQuery(query);
    let allChunks = await this.findAndMapChunks(embedding);

    let contextChunks: SearchResultChunk[];
    if (useReranker) {
      allChunks = await this.rerankChunks(query, allChunks);
      contextChunks = allChunks.filter(chunk => (chunk.rerankerScore ?? 0) > RERANKER_SCORE_THRESHOLD);
    } else {
      allChunks.sort((a, b) => b.vectorScore - a.vectorScore);
      contextChunks = allChunks.slice(0, LLM_CONTEXT_LIMIT);
      allChunks = contextChunks;
    }

    const { systemPrompt, userMessage } = this.buildPrompt(contextChunks, query);
    const answer = await this.generateAnswer(systemPrompt, userMessage);

    return { answer, chunks: allChunks, prompt: userMessage, contextChunksCount: contextChunks.length };
  }

  private async embedQuery(query: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    });
    return response.data[0].embedding;
  }

  private async findAndMapChunks(embedding: number[]): Promise<SearchResultChunk[]> {
    const vectorChunks = await this.chunkerService.findSimilarChunks(embedding, SIMILARITY_LIMIT);
    console.log(`Found ${vectorChunks.length} similar chunks`);

    return vectorChunks.map(chunk => ({
      id: chunk.id,
      sourceFilename: chunk.sourceFilename,
      content: chunk.content,
      vectorScore: chunk.vectorScore
    }));
  }

  private async rerankChunks(query: string, chunks: SearchResultChunk[]): Promise<SearchResultChunk[]> {
    console.log('Reranking chunks with Cohere...');

    const response = await this.cohere.rerank({
      model: 'rerank-english-v3.0',
      query,
      documents: chunks.map(chunk => chunk.content)
    });

    for (const result of response.results) {
      chunks[result.index].rerankerScore = result.relevanceScore;
    }

    chunks.sort((a, b) => (b.rerankerScore ?? 0) - (a.rerankerScore ?? 0));
    console.log(`Using top ${LLM_CONTEXT_LIMIT} reranked chunks for LLM context`);

    return chunks;
  }

  private buildPrompt(contextChunks: SearchResultChunk[], query: string): { systemPrompt: string; userMessage: string } {
    const systemPrompt = [
      'You are a helpful assistant that answers questions based only on the provided context.',
      'If the answer cannot be found in the context, say "I don\'t have that information in the provided documents."',
      'Do not make up information or use knowledge outside of the provided context. Don\'t go out of scope, and stay brief'
    ].join('\n');

    const contextBlock = contextChunks
      .map(chunk => `[Source: ${chunk.sourceFilename}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    const userMessage = `Context:\n${contextBlock}\n\n---\n\nQuestion: ${query}`;

    return { systemPrompt, userMessage };
  }

  private async generateAnswer(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    const answer = response.choices[0].message.content ?? '';
    console.log('LLM response:', answer);

    return answer;
  }
}
