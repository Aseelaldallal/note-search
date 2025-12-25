import { Pool } from 'pg';
import { plainToInstance } from 'class-transformer';
import { Database } from '../database/db';
import { Chunk } from '../models/chunk.model';

export type ChunkWithSimilarity = Omit<Chunk, 'embedding'> & { vectorScore: number };

export class ChunkRepository {
  private readonly pool: Pool;

  constructor(db: Database) {
    this.pool = db.getPool();
  }

  public async insertChunk(chunk: {
    source_filename: string;
    content: string;
    embedding: number[];
  }): Promise<Chunk> {
    const embeddingStr = '[' + chunk.embedding.join(',') + ']';

    const result = await this.pool.query(
      `INSERT INTO chunks (source_filename, content, embedding)
       VALUES ($1, $2, $3)
       RETURNING id, source_filename, content`,
      [chunk.source_filename, chunk.content, embeddingStr]
    );

    return plainToInstance(Chunk, result.rows[0], {
      excludeExtraneousValues: true, // Only @Expose'd properties
    });
  }

  /**
   * Find chunks most similar to the given embedding using cosine similarity.
   *
   * pgvector's <=> operator returns cosine distance (0 to 2):
   *   0 = Identical direction (most similar)
   *   1 = Perpendicular (unrelated)
   *   2 = Opposite direction (least similar)
   *
   * We use "1 - distance" to convert to similarity score where higher = more similar.
   *
   * Example:
   *   Direction      | Cosine Distance | Similarity (1 - dist)
   *   -----------------------------------------------------
   *   Same           | 0               | 1
   *   Perpendicular  | 1               | 0
   *   Opposite       | 2               | -1
   */
  public async findSimilar(embedding: number[], limit: number ): Promise<ChunkWithSimilarity[]> {
    const embeddingStr = '[' + embedding.join(',') + ']';

    const result = await this.pool.query(
      `SELECT id, source_filename, content,
              1 - (embedding <=> $1) AS vector_score
       FROM chunks
       ORDER BY embedding <=> $1
       LIMIT $2`,
      [embeddingStr, limit]
    );

    return result.rows.map(row => ({
      // excludeExtraneousValues: true means only properties decorated with @Expose
      // are included in the result. The Chunk model uses @Expose for id, sourceFilename,
      // and content, but marks embedding with @Exclude - so embedding won't be returned.
      ...plainToInstance(Chunk, row, { excludeExtraneousValues: true }),
      vectorScore: row.vector_score
    }));
  }
}
