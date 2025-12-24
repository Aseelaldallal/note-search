import { Router } from 'express';
import uploadRoutes from './upload.routes';
import searchRoutes from './search.routes';

const router = Router();

router.use(uploadRoutes);
router.use(searchRoutes);

export default router;
