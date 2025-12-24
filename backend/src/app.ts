import express, { Express } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { getDatabaseInstance } from './database/db.factory';
import { getBossInstance } from './queue/boss.factory';
import { ChunkRepository } from './repositories/chunk.repository';
import { ChunkerService } from './services/chunker.service';
import { createProcessFileHandler } from './workers/chunker.worker';
import { createUploadRouter } from './routes/upload.routes.factory';
import { createSearchRouter } from './routes/search.routes.factory';

export async function createApp(): Promise<Express> {
  const app = express();

  // Dependencies
  const db = getDatabaseInstance();
  const boss = await getBossInstance();

  // Register workers
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const chunkRepository = new ChunkRepository(db);
  const chunkerService = new ChunkerService(chunkRepository, openai);
  boss.work('process-file', { batchSize: 3 }, createProcessFileHandler(chunkerService));
  console.log('✅ pg-boss worker registered');

  // Middleware
  app.use(express.json());
  app.use(cors());  // TODO: Any website can call API now

  // Routes
  const uploadRouter = await createUploadRouter();
  const searchRouter = createSearchRouter(chunkerService, openai);
  app.use('/api/upload', uploadRouter);
  app.use('/api/search', searchRouter);

  return app;
}
