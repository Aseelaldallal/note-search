import OpenAI from 'openai';
import { ChunkerService } from './chunker.service';



const SIMILARITY_LIMIT = 10;

export class SearchService {
  constructor(
    private readonly chunkerService: ChunkerService,
    private readonly openai: OpenAI
  ) {}

  public async search(query: string): Promise<void> {
    // 1. Embed the query
    console.log('Embedding query...');
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    });
    const queryEmbedding = response.data[0].embedding;

    // 2. Find similar chunks
    const chunks = await this.chunkerService.findSimilarChunks(queryEmbedding, SIMILARITY_LIMIT);
    console.log(`Found ${chunks.length} similar chunks`);

    // 3. Log results (temporary - will return to UI later)
    chunks.forEach((chunk, i) => {
      console.log(`[${i + 1}] (${chunk.similarity.toFixed(3)}) ${chunk.sourceFilename}: ${chunk.content.substring(0, 80)}...`);
    });


  }
}
