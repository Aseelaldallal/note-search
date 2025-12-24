/**
 * CHUNKING STRATEGY
 *
 * Using LangChain's RecursiveCharacterTextSplitter for simplicity.
 *
 * In production, chunking quality often matters more than which LLM you use.
 * If chunks are broken (code blocks split, missing context, headers gone),
 * it doesn't matter how smart your retrieval or LLM is — garbage in, garbage out.
 *
 * Current (simplistic) approach:
 * - RecursiveCharacterTextSplitter with markdown-aware separators
 * - Splits by: # headers → ## headers → **bold** → paragraphs → lines → spaces
 * - 100 char overlap to preserve context at chunk boundaries
 */

import fs from 'fs/promises';
import OpenAI from 'openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ChunkRepository, ChunkWithSimilarity } from '../repositories/chunk.repository';

const SIMILARITY_LIMIT = 10;

export class ChunkerService {
  constructor(
    private readonly chunkRepository: ChunkRepository,
    private readonly openai: OpenAI
  ) {}

  public async processFile(filePath: string, originalName: string): Promise<void> {
    console.log(`Processing file: ${originalName}`);

    const content = await fs.readFile(filePath, 'utf-8');

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
      separators: ['\n# ', '\n## ', '\n**', '\n\n', '\n', ' ']
    });

    const docs = await splitter.createDocuments([content]);

    for (let i = 0; i < docs.length; i++) {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: docs[i].pageContent
      });

      await this.chunkRepository.insertChunk({
        source_filename: originalName,
        content: docs[i].pageContent,
        embedding: response.data[0].embedding
      });

      console.log(`Embedded and stored chunk ${i + 1}/${docs.length}`);
    }

    await fs.unlink(filePath);

    console.log(`✅ Finished processing: ${originalName}, created ${docs.length} chunks`);
  }

  public async findSimilarChunks(embedding: number[]): Promise<ChunkWithSimilarity[]> {
    return this.chunkRepository.findSimilar(embedding, SIMILARITY_LIMIT);
  }
}
