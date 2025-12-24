import { Router } from 'express';
import { getBossInstance } from '../queue/boss.factory';
import { PgBossQueue } from '../queue/pgboss-queue';
import { UploadService } from '../services/upload.service';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middleware/upload';

export async function createUploadRouter(): Promise<Router> {
  const router = Router();

  // Wire up dependencies
  const boss = await getBossInstance();
  const jobQueue = new PgBossQueue(boss);
  const uploadService = new UploadService(jobQueue);
  const uploadController = new UploadController(uploadService);

  // Routes
  router.post(
    '/',
    upload.array('files'),
    (req, res) => uploadController.uploadFiles(req, res)
  );

  return router;
}
