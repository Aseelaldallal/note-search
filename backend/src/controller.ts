import { Request, Response } from 'express';

// Health check controller
export const healthCheck = (_req: Request, res: Response): void => {
  res.json({ message: 'Backend server is running!' });
};

// File upload controller
export const uploadFile = (_req: Request, res: Response): void => {
  console.log('Received file upload request');
  // TODO: Implement file upload logic with multer or similar
  res.json({ message: 'File upload endpoint - implementation pending' });
};
