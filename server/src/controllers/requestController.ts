import { Request, Response } from 'express';
import { db } from '../models/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { UrgencyLevel } from '../types';

export const getRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, urgency, search } = req.query;
    const requests = await db.getRequests({
      category: category as string,
      status: status as string,
      urgency: urgency as string,
      search: search as string,
    });
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch requests: ' + error.message });
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await db.getRequestById(id);
    if (!request) {
      res.status(404).json({ error: 'Assistance request not found.' });
      return;
    }

    const responses = await db.getResponsesByRequestId(id);
    res.status(200).json({ ...request, responses });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve request: ' + error.message });
  }
};

export const createRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required to post a request.' });
      return;
    }

    const { title, description, category_id, urgency, location, contact_info, image_url } = req.body;

    if (!title || !description || !category_id || !location) {
      res.status(400).json({ error: 'Title, description, category, and location are required fields.' });
      return;
    }

    const newRequest = await db.createRequest({
      title,
      description,
      category_id,
      user_id: req.user.id,
      urgency: (urgency as UrgencyLevel) || 'medium',
      status: 'open',
      location,
      contact_info: contact_info || req.user.email,
      image_url: image_url || undefined,
    });

    res.status(201).json({
      message: 'Assistance request posted successfully',
      request: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create request: ' + error.message });
  }
};

export const updateRequestStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    const request = await db.getRequestById(id);
    if (!request) {
      res.status(404).json({ error: 'Request not found.' });
      return;
    }

    // Only request creator or admin can update status
    if (request.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'Only the author of the request can update its status.' });
      return;
    }

    const updated = await db.updateRequestStatus(id, status);
    res.status(200).json({
      message: `Request status updated to ${status}`,
      request: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update request status: ' + error.message });
  }
};

export const deleteRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const request = await db.getRequestById(id);
    if (!request) {
      res.status(404).json({ error: 'Request not found.' });
      return;
    }

    if (request.user_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'Not authorized to delete this request.' });
      return;
    }

    await db.deleteRequest(id);
    res.status(200).json({ message: 'Request deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete request: ' + error.message });
  }
};
