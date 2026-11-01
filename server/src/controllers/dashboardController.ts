import { Response } from 'express';
import { db } from '../models/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getImpactStats = async (_req: any, res: Response): Promise<void> => {
  try {
    const stats = await db.getImpactStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch impact statistics: ' + error.message });
  }
};

export const getUserDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const dashboard = await db.getUserDashboard(req.user.id);
    res.status(200).json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user dashboard: ' + error.message });
  }
};
