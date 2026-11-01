import { Router } from 'express';
import { offerAssistance, updateResponseStatus } from '../controllers/responseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/request/:requestId', authenticateToken as any, offerAssistance as any);
router.patch('/:id/status', authenticateToken as any, updateResponseStatus as any);

export default router;
