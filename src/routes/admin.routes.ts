import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(verifyAuth, requireRole('ADMIN'));

// GET /api/admin/dashboard
router.get('/dashboard', adminController.getDashboard);

// Donor management
router.get('/donors', adminController.getDonors);
router.delete('/donors/:id', adminController.deleteDonor);

// Organization management
router.get('/organizations', adminController.getOrganizations);
router.patch('/organizations/:id/approve', adminController.approveOrganization);
router.patch('/organizations/:id/reject', adminController.rejectOrganization);

// Form management
router.get('/forms', adminController.getAllForms);
router.get('/forms/:id', adminController.getFormById);
router.post('/forms', adminController.createForm);
router.put('/forms/:id', adminController.updateForm);
router.delete('/forms/:id', adminController.deleteForm);

// Form field management
router.post('/forms/:formId/fields', adminController.addFormField);
router.put('/forms/fields/:fieldId', adminController.updateFormField);
router.delete('/forms/fields/:fieldId', adminController.deleteFormField);
router.patch('/forms/:formId/fields/reorder', adminController.reorderFormFields);

// Submission management
router.get('/submissions', adminController.getAllSubmissions);
router.patch('/submissions/:id/review', adminController.reviewSubmission);

export default router;
