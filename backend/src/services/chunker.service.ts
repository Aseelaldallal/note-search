import { ChunkRepository } from '../repositories/chunk.repository';

export class ChunkerService {
  constructor(private readonly chunkRepository: ChunkRepository) {}

  async processFile(filePath: string, originalName: string): Promise<void> {
    console.log(`Processing file: ${originalName} at ${filePath}`);
    // Will use this.chunkRepository when implementing chunking logic
    void this.chunkRepository;
  }
}
