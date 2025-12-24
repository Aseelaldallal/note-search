import { Request, Response } from 'express';
import { getBossInstance } from '../queue/boss.factory';

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const boss = await getBossInstance();

    for (const file of files) {
      await boss.send('process-file', {
        filePath: file.path,
        originalName: file.originalname
      });
      console.log(`Queued job for: ${file.originalname}`);
    }

    res.json({ message: 'Files queued for processing', count: files.length });
  } catch (error) {
    console.error('Error queueing files:', error);
    res.status(500).json({ error: 'Failed to queue files' });
  }
};
