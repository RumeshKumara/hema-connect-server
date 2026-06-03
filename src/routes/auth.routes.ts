import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me  (protected)
router.get('/me', verifyAuth, authController.me);

export default router;
