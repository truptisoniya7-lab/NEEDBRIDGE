import { Router } from 'express';
import { getImpactStats, getUserDashboard } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/impact', getImpactStats);
router.get('/user', authenticateToken as any, getUserDashboard as any);

export default router;
