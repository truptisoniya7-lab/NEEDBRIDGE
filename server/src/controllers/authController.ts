import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models/db';
import { AuthenticatedRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'needbridge_jwt_secret_development_key_12345';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, role, phone, location } = req.body;

    if (!email || !password || !full_name) {
      res.status(400).json({ error: 'Email, password, and full name are required.' });
      return;
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await db.createUser({
      email,
      password_hash,
      full_name,
      role: role === 'volunteer' ? 'volunteer' : 'user',
    });

    if (phone || location) {
      await db.updateUser(newUser.id, { phone, location });
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...userProfile } = newUser;
    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: userProfile,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register account: ' + error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...userProfile } = user;
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: userProfile,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in: ' + error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const user = await db.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const { password_hash: _, ...userProfile } = user;
    res.status(200).json(userProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { full_name, bio, phone, location, avatar_url } = req.body;
    const updated = await db.updateUser(req.user.id, {
      ...(full_name && { full_name }),
      ...(bio !== undefined && { bio }),
      ...(phone !== undefined && { phone }),
      ...(location !== undefined && { location }),
      ...(avatar_url !== undefined && { avatar_url }),
    });

    if (!updated) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const { password_hash: _, ...userProfile } = updated;
    res.status(200).json({ message: 'Profile updated successfully', user: userProfile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
