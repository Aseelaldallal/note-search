import express, { Express } from 'express';
import cors from 'cors';
import { getDatabaseInstance } from './database/db.factory';
import { getBossInstance } from './queue/boss.factory';
import { ChunkRepository } from './repositories/chunk.repository';
import { ChunkerService } from './services/chunker.service';
import { createProcessFileHandler } from './workers/chunker.worker';
import { createUploadRouter } from './routes/upload.routes.factory';
import searchRoutes from './routes/search.routes';

export async function createApp(): Promise<Express> {
  const app = express();

  // Dependencies
  const db = getDatabaseInstance();
  const boss = await getBossInstance();
  const chunkRepository = new ChunkRepository(db);
  const chunkerService = new ChunkerService(chunkRepository);

  // Register workers
  boss.work('process-file', createProcessFileHandler(chunkerService));
  console.log('✅ pg-boss worker registered');

  // Middleware
  app.use(cors());  // TODO: Any website can call API now

  // Routes
  const uploadRouter = await createUploadRouter();
  app.use('/api/upload', uploadRouter);
  app.use('/api/search', searchRoutes);

  return app;
}
