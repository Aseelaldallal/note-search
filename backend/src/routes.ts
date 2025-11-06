import { Router } from 'express';
import { uploadFiles } from './controller';
import { upload } from './middleware/upload';

const router = Router();

// Upload endpoint with Multer middleware
// .array('files') matches the field name from the frontend FormData
router.post('/api/upload', upload.array('files'), uploadFiles);

export default router;
