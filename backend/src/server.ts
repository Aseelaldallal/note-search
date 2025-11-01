import express, { Request, Response } from 'express';
import cors from 'cors';

export const app = express();

// Middleware
app.use(cors());  // TODO: Any website can call API now
app.use(express.json());

// Basic route
app.get('/', (_req: Request, res: Response): void => {
  res.json({ message: 'Backend server is running!' });
});

// File upload route (barebones - you'll implement the actual upload logic)
app.post('/api/upload', (_req: Request, res: Response): void => {
  console.log('Received file upload request');
  // TODO: Implement file upload logic with multer or similar
  res.json({ message: 'File upload endpoint - implementation pending' });
});

