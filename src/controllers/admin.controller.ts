import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as formRepo from '../repositories/form.repository';
import { sendSuccess, sendError } from '../utils/response';
import { SubmissionStatus } from '@prisma/client';

export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, stats, 'Dashboard fetched');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getDonors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const donors = await adminService.getAllDonors();
    sendSuccess(res, donors);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const deleteDonor = async (req: Request, res: Response): Promise<void> => {
  try {
    await adminService.deleteDonorById(Number(req.params.id));
    sendSuccess(res, null, 'Donor deleted');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getOrganizations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orgs = await adminService.getAllOrganizations();
    sendSuccess(res, orgs);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const approveOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const org = await adminService.approveOrganization(Number(req.params.id));
    sendSuccess(res, org, 'Organization approved');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const rejectOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const org = await adminService.rejectOrganization(Number(req.params.id));
    sendSuccess(res, org, 'Organization rejected');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getAllSubmissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await adminService.getAllSubmissions();
    sendSuccess(res, submissions);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const reviewSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, reviewNote } = req.body as {
      status: SubmissionStatus;
      reviewNote?: string;
    };

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      sendError(res, 'Status must be APPROVED or REJECTED', 400);
      return;
    }

    const submission = await adminService.reviewSubmission(
      Number(req.params.id),
      status,
      reviewNote,
    );
    sendSuccess(res, submission, `Submission ${status.toLowerCase()}`);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

// Form management (Admin)
export const createForm = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const { title, description, fields } = req.body as {
      title: string;
      description?: string;
      fields?: formRepo.FormFieldInput[];
    };
    if (!title) { sendError(res, 'Title is required', 400); return; }

    const form = await formRepo.createForm({ title, description, createdById: req.user.id, fields });
    sendSuccess(res, form, 'Form created', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const updateForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await formRepo.updateForm(Number(req.params.id), req.body as Parameters<typeof formRepo.updateForm>[1]);
    sendSuccess(res, form, 'Form updated');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const deleteForm = async (req: Request, res: Response): Promise<void> => {
  try {
    await formRepo.deleteForm(Number(req.params.id));
    sendSuccess(res, null, 'Form deleted');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getAllForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const forms = await formRepo.findAllForms();
    sendSuccess(res, forms);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getFormById = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await formRepo.findFormById(Number(req.params.id));
    if (!form) { sendError(res, 'Form not found', 404); return; }
    sendSuccess(res, form);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

// Field management
export const addFormField = async (req: Request, res: Response): Promise<void> => {
  try {
    const field = await formRepo.addFormField(Number(req.params.formId), req.body as formRepo.FormFieldInput);
    sendSuccess(res, field, 'Field added', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const updateFormField = async (req: Request, res: Response): Promise<void> => {
  try {
    const field = await formRepo.updateFormField(Number(req.params.fieldId), req.body as Partial<formRepo.FormFieldInput>);
    sendSuccess(res, field, 'Field updated');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const deleteFormField = async (req: Request, res: Response): Promise<void> => {
  try {
    await formRepo.deleteFormField(Number(req.params.fieldId));
    sendSuccess(res, null, 'Field deleted');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const reorderFormFields = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fields } = req.body as { fields: { id: number; order: number }[] };
    const result = await formRepo.reorderFormFields(fields);
    sendSuccess(res, result, 'Fields reordered');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};
