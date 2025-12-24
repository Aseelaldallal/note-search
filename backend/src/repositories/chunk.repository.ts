import { plainToInstance } from 'class-transformer';
import { Database } from '../database/db';
import { Chunk } from '../models/chunk.model';

export class ChunkRepository {
  constructor(private readonly db: Database) {}

  public async insertChunk(chunk: {
    source_filename: string;
    content: string;
    embedding: number[];
  }): Promise<Chunk> {
    const pool = this.db.getPool();
    const embeddingStr = '[' + chunk.embedding.join(',') + ']';

    const result = await pool.query(
      `INSERT INTO chunks (source_filename, content, embedding)
       VALUES ($1, $2, $3)
       RETURNING id, source_filename, content`,
      [chunk.source_filename, chunk.content, embeddingStr]
    );

    return plainToInstance(Chunk, result.rows[0], {
      excludeExtraneousValues: true,
    });
  }
}
