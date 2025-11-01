import { Router, Request, Response } from 'express';

const router = Router();

// Health check route
router.get('/', (_req: Request, res: Response): void => {
  res.json({ message: 'Backend server is running!' });
});

// File upload route
router.post('/api/upload', (_req: Request, res: Response): void => {
  console.log('Received file upload request');
  // TODO: Implement file upload logic with multer or similar
  res.json({ message: 'File upload endpoint - implementation pending' });
});

export default router;
