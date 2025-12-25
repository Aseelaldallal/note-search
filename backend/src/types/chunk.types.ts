import type { Chunk } from '../models/chunk.model';

export type ChunkWithSimilarity = Omit<Chunk, 'embedding'> & { vectorScore: number };
