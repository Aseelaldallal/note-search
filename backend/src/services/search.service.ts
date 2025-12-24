import OpenAI from 'openai';
import { ChunkerService } from './chunker.service';
import { ChunkWithSimilarity } from '../repositories/chunk.repository';

const SIMILARITY_LIMIT = 10;

interface SearchResult {
  answer: string;
  chunks: ChunkWithSimilarity[];
  prompt: string;
}

export class SearchService {
  constructor(
    private readonly chunkerService: ChunkerService,
    private readonly openai: OpenAI
  ) {}

  public async search(query: string): Promise<SearchResult> {
    // 1. Embed the query
    console.log('Embedding query...');
    const embeddingResponse = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Find similar chunks
    const chunks = await this.chunkerService.findSimilarChunks(queryEmbedding, SIMILARITY_LIMIT);
    console.log(`Found ${chunks.length} similar chunks`);

    // 3. Build prompt
    const systemPrompt = [
      'You are a helpful assistant that answers questions based only on the provided context.',
      'If the answer cannot be found in the context, say "I don\'t have that information in the provided documents."',
      'Do not make up information or use knowledge outside of the provided context. Don\'t go out of scope, and stay brief'
    ].join('\n');

    const contextBlock = chunks
      .map((chunk, i) => `[Source: ${chunk.sourceFilename}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    const userMessage = `Context:\n${contextBlock}\n\n---\n\nQuestion: ${query}`;

    // 4. Call OpenAI chat completion
    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        // system: Instructions for LLM behavior. Sets "persona" and rules. Treated as high-priority guidance.
        { role: 'system', content: systemPrompt },
        // user: The human's message. What you're asking or providing.
        { role: 'user', content: userMessage }
      ]
    });

    const answer = chatResponse.choices[0].message.content ?? '';
    console.log('LLM response:', answer);

    // 5. Return result
    return {
      answer,
      chunks,
      prompt: userMessage
    };
  }
}
