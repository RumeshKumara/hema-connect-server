import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import { sendError } from '../utils/response';

// Extend Express Request to carry the decoded Firebase token
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

/**
 * Verifies the Firebase ID Token sent in the Authorization header.
 * On success, attaches the decoded token to req.user.
 * The token contains: uid, email, and any custom claims (e.g. role).
 */
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Missing or invalid authorization header', 401);
    return;
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired Firebase token', 401);
  }
};
