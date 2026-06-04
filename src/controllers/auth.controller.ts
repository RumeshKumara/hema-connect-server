import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { Role } from '@prisma/client';

/**
 * POST /api/auth/sync
 * Called by the frontend after Firebase sign-in to create or fetch the local user record.
 * The Firebase ID token is verified by verifyAuth middleware before this runs.
 */
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const { uid, email, name } = req.user;
    const user = await authService.syncUser(
      uid,
      email ?? '',
      (name as string) ?? '',
    );

    sendSuccess(res, user, 'User synced successfully', 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    sendError(res, message, 500);
  }
};

/**
 * GET /api/auth/me  (protected)
 * Returns the current authenticated user's profile from the local DB.
 */
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const user = await authService.getMe(req.user.uid);

    if (!user) {
      sendError(res, 'User not found. Please sync first.', 404);
      return;
    }

    sendSuccess(res, user, 'Profile fetched successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    sendError(res, message, 500);
  }
};

/**
 * PATCH /api/auth/role  (admin only)
 * Assigns a role to a user by their Firebase UID.
 * Sets both the DB role and the Firebase Custom Claim so the frontend sees it.
 */
export const assignRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, role } = req.body as { uid: string; role: Role };

    if (!uid || !role) {
      sendError(res, 'uid and role are required', 400);
      return;
    }

    const validRoles = Object.values(Role);
    if (!validRoles.includes(role)) {
      sendError(res, `Invalid role. Must be one of: ${validRoles.join(', ')}`, 400);
      return;
    }

    const user = await authService.assignRole(uid, role);
    sendSuccess(res, user, `Role updated to ${role} successfully`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to assign role';
    sendError(res, message, 500);
  }
};
