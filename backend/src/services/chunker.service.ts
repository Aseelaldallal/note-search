/**
 * CHUNKING STRATEGY
 *
 * Using LangChain's RecursiveCharacterTextSplitter for simplicity.
 *
 * In production, chunking quality often matters more than which LLM you use.
 * If chunks are broken (code blocks split, missing context, headers gone),
 * it doesn't matter how smart your retrieval or LLM is — garbage in, garbage out.
 *
 * Current (simplistic approach:
 * - RecursiveCharacterTextSplitter with markdown-aware separators
 * - Splits by: # headers → ## headers → **bold** → paragraphs → lines → spaces
 * - 100 char overlap to preserve context at chunk boundaries
 */

import fs from 'fs/promises';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ChunkRepository } from '../repositories/chunk.repository';

export class ChunkerService {
  constructor(private readonly chunkRepository: ChunkRepository) {
    void this.chunkRepository; // Will use when implementing DB persistence
  }

  async processFile(filePath: string, originalName: string): Promise<void> {
    console.log(`Processing file: ${originalName}`);

    const content = await fs.readFile(filePath, 'utf-8');

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
      separators: ['\n# ', '\n## ', '\n**', '\n\n', '\n', ' ']
    });

    const docs = await splitter.createDocuments([content]);

    for (let i = 0; i < docs.length; i++) {
      console.log(`Will now call OpenAI to generate embedding for chunk ${i}`);
      console.log(`  Preview: ${docs[i].pageContent.substring(0, 100)}...`);
    }

    await fs.unlink(filePath);

    console.log(`✅ Finished processing: ${originalName}, created ${docs.length} chunks`);
  }
}
