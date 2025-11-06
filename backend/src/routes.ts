import { Router } from 'express';
import { healthCheck, uploadFile } from './controller';

const router = Router();

// Health check route
router.get('/', healthCheck);

// File upload route
router.post('/api/upload', uploadFile);

export default router;
