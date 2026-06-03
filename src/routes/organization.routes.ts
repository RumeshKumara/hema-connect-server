import { Router } from 'express';
import * as orgController from '../controllers/organization.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// All organization routes require authentication + ORGANIZATION role
router.use(verifyAuth, requireRole('ORGANIZATION'));

// Dashboard
router.get('/dashboard', orgController.getDashboard);

// Profile
router.get('/profile', orgController.getProfile);
router.put('/profile', orgController.updateProfile);

// Donation Requests
router.post('/request', orgController.createDonationRequest);
router.get('/requests', orgController.getMyDonationRequests);
router.patch('/requests/:id/publish', orgController.publishDonationRequest);
router.delete('/requests/:id', orgController.deleteDonationRequest);

// Form builder
router.post('/forms', orgController.createForm);
router.get('/forms', orgController.getMyForms);
router.patch('/forms/:id/publish', orgController.publishForm);
router.post('/forms/:formId/fields', orgController.addFormField);
router.delete('/forms/fields/:fieldId', orgController.removeFormField);
router.patch('/forms/:formId/fields/reorder', orgController.reorderFormFields);

// Submissions received
router.get('/submissions', orgController.getReceivedSubmissions);

// Notifications
router.get('/notifications', orgController.getNotifications);

export default router;
