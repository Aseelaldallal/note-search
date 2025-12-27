import { Router } from 'express';
import { getContainer, TOKENS } from '../container';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middleware/upload';

export function createUploadRouter(): Router {
  const router = Router();
  const uploadController = getContainer().get<UploadController>(TOKENS.UploadController);

  router.post('/', upload.array('files'), (req, res) => uploadController.uploadFiles(req, res));

  return router;
}
