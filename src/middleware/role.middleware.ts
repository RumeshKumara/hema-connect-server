import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Checks that req.user (set by verifyAuth) has one of the allowed roles.
 * The role is read from Firebase Custom Claims: req.user.role
 *
 * Usage example:
 *   router.get('/admin-only', verifyAuth, requireRole('ADMIN'), handler);
 *   router.get('/staff', verifyAuth, requireRole('ADMIN', 'ORGANIZATION'), handler);
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const userRole = req.user.role as string | undefined;

    if (!userRole || !roles.includes(userRole)) {
      sendError(res, 'Forbidden: insufficient permissions', 403);
      return;
    }

    next();
  };
};
