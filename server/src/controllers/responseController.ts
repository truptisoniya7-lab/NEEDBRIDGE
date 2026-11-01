import { Response } from 'express';
import { db } from '../models/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { ResponseStatus } from '../types';

export const offerAssistance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required to offer assistance.' });
      return;
    }

    const { requestId } = req.params;
    const { message, contact_phone } = req.body;

    if (!message || message.trim() === '') {
      res.status(400).json({ error: 'A helpful message is required when offering assistance.' });
      return;
    }

    const request = await db.getRequestById(requestId);
    if (!request) {
      res.status(404).json({ error: 'Request not found.' });
      return;
    }

    if (request.user_id === req.user.id) {
      res.status(400).json({ error: 'You cannot offer assistance to your own request.' });
      return;
    }

    const newResponse = await db.createResponse({
      request_id: requestId,
      helper_id: req.user.id,
      message,
      contact_phone: contact_phone || undefined,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Offer of assistance submitted successfully!',
      response: newResponse,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit assistance offer: ' + error.message });
  }
};

export const updateResponseStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body as { status: ResponseStatus };

    if (!['pending', 'accepted', 'completed', 'declined'].includes(status)) {
      res.status(400).json({ error: 'Invalid response status.' });
      return;
    }

    const updated = await db.updateResponseStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Response not found.' });
      return;
    }

    res.status(200).json({
      message: `Assistance offer status updated to ${status}`,
      response: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update response: ' + error.message });
  }
};
