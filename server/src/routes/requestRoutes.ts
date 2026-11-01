import { Router } from 'express';
import {
  getRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} from '../controllers/requestController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getRequests);
router.get('/:id', getRequestById);
router.post('/', authenticateToken as any, createRequest as any);
router.patch('/:id/status', authenticateToken as any, updateRequestStatus as any);
router.delete('/:id', authenticateToken as any, deleteRequest as any);

export default router;
