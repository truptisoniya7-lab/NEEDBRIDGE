import { Request, Response } from 'express';
import { db } from '../models/db';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await db.getCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories: ' + error.message });
  }
};
