import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TOKENS } from '../container';
import { UploadService } from '../services/upload.service';

@injectable()
export class UploadController {
  // @inject(TOKEN) tells Inversify "look up what's bound to this token and pass it as this parameter"
  constructor(@inject(TOKENS.UploadService) private readonly uploadService: UploadService) {}

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
