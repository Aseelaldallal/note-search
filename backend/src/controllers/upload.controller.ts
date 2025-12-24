import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';

export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  async uploadFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
      }

      const count = await this.uploadService.queueFilesForProcessing(files);

      res.json({ message: 'Files queued for processing', count });
    } catch (error) {
      console.error('Error queueing files:', error);
      res.status(500).json({ error: 'Failed to queue files' });
    }
  }
}
