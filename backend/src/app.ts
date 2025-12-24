import express, { Express } from 'express';
import cors from 'cors';
import { createUploadRouter } from './routes/upload.routes.factory';
import searchRoutes from './routes/search.routes';

export async function createApp(): Promise<Express> {
  const app = express();

  // Middleware
  app.use(cors());  // TODO: Any website can call API now

  // Routes
  const uploadRouter = await createUploadRouter();
  app.use('/api/upload', uploadRouter);
  app.use('/api/search', searchRoutes);

  return app;
}
