import { Router } from 'express';
import * as donorController from '../controllers/donor.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// All donor routes require authentication + DONOR role
router.use(verifyAuth, requireRole('DONOR'));

// GET /api/donor/forms  - list all published forms
router.get('/forms', donorController.getForms);
router.get('/forms/:id', donorController.getFormDetails);

// POST /api/donor/submissions  - submit a donation form
router.post('/submissions', donorController.submitForm);

// GET /api/donor/history  - all past submissions
router.get('/history', donorController.getDonationHistory);

// Profile
router.get('/profile', donorController.getDonorProfile);
router.put('/profile', donorController.updateDonorProfile);

// Notifications
router.get('/notifications', donorController.getNotifications);
router.patch('/notifications/:id/read', donorController.markNotificationRead);
router.patch('/notifications/read-all', donorController.markAllNotificationsRead);

export default router;
