import express, { Express } from 'express';
import cors from 'cors';
import { PgBoss } from 'pg-boss';
import { getContainer, TOKENS } from './container';
import { ChunkerService } from './services/chunker.service';
import { createProcessFileHandler } from './workers/chunker.worker';
import { createUploadRouter } from './routes/upload.routes';
import { createSearchRouter } from './routes/search.routes';

export function createApp(): Express {
  const app = express();
  const container = getContainer();

  // Get dependencies from container
  const boss = container.get<PgBoss>(TOKENS.PgBoss);
  const chunkerService = container.get<ChunkerService>(TOKENS.ChunkerService);

  // Register workers
  boss.work('process-file', { batchSize: 3 }, createProcessFileHandler(chunkerService));
  console.log('pg-boss worker registered');

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Routes
  app.use('/api/upload', createUploadRouter());
  app.use('/api/search', createSearchRouter());

  return app;
}
