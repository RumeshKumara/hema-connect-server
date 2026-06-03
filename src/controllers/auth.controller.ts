import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: Role;
    };

    if (!name || !email || !password) {
      sendError(res, 'Name, email, and password are required', 400);
      return;
    }

    const data = await authService.registerUser(name, email, password, role);
    sendSuccess(res, data, 'Registration successful', 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    sendError(res, message, 400);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    const data = await authService.loginUser(email, password);
    sendSuccess(res, data, 'Login successful');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    sendError(res, message, 401);
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, user, 'Profile fetched successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    sendError(res, message, 500);
  }
};
