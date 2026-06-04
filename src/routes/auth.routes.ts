import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// POST /api/auth/sync  — called after Firebase sign-in to sync user into local DB
router.post('/sync', verifyAuth, authController.syncUser);

// GET /api/auth/me  — returns current user's profile (protected)
router.get('/me', verifyAuth, authController.me);

// PATCH /api/auth/role  — admin assigns a role to any user (admin only)
router.patch('/role', verifyAuth, requireRole('ADMIN'), authController.assignRole);

export default router;
