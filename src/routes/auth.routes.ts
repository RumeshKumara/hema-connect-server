import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyAuth, authController.me);

export default router;
