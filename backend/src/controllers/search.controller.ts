import { Request, Response } from 'express';

// TODO: implement
export const search = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ error: 'Not implemented' });
};
