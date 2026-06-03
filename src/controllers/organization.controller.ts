import { Request, Response } from 'express';
import * as orgService from '../services/organization.service';
import { sendSuccess, sendError } from '../utils/response';
import { FormFieldInput } from '../repositories/form.repository';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const profile = await orgService.getOrganizationProfile(req.user.id);
    if (!profile) { sendError(res, 'Organization profile not found', 404); return; }
    sendSuccess(res, profile);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const data = req.body as {
      organizationName?: string;
      location?: string;
      contactNumber?: string;
      description?: string;
    };
    const profile = await orgService.updateOrganizationProfile(req.user.id, data);
    sendSuccess(res, profile, 'Profile updated');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

// Donation Requests
export const createDonationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const body = req.body as {
      title: string;
      description?: string;
      requiredCount?: number;
      requiredDate?: string;
      location?: string;
      contactNumber?: string;
    };

    if (!body.title) { sendError(res, 'Title is required', 400); return; }

    const request = await orgService.createDonationRequest(req.user.id, {
      ...body,
      requiredDate: body.requiredDate ? new Date(body.requiredDate) : undefined,
    });
    sendSuccess(res, request, 'Donation request created', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 400);
  }
};

export const getMyDonationRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const requests = await orgService.getMyDonationRequests(req.user.id);
    sendSuccess(res, requests);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const publishDonationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isPublished } = req.body as { isPublished: boolean };
    const request = await orgService.publishDonationRequest(Number(req.params.id), isPublished);
    sendSuccess(res, request, `Request ${isPublished ? 'published' : 'unpublished'}`);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const deleteDonationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    await orgService.deleteDonationRequest(Number(req.params.id));
    sendSuccess(res, null, 'Donation request deleted');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

// Form management
export const createForm = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const { title, description, fields } = req.body as {
      title: string;
      description?: string;
      fields?: FormFieldInput[];
    };
    if (!title) { sendError(res, 'Title is required', 400); return; }
    const form = await orgService.createForm(req.user.id, title, description, fields);
    sendSuccess(res, form, 'Form created', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getMyForms = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const forms = await orgService.getMyForms(req.user.id);
    sendSuccess(res, forms);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const publishForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isPublished } = req.body as { isPublished: boolean };
    const form = await orgService.publishForm(Number(req.params.id), isPublished);
    sendSuccess(res, form, `Form ${isPublished ? 'published' : 'unpublished'}`);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const addFormField = async (req: Request, res: Response): Promise<void> => {
  try {
    const field = await orgService.addFieldToForm(Number(req.params.formId), req.body as FormFieldInput);
    sendSuccess(res, field, 'Field added', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const removeFormField = async (req: Request, res: Response): Promise<void> => {
  try {
    await orgService.removeFieldFromForm(Number(req.params.fieldId));
    sendSuccess(res, null, 'Field removed');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const reorderFormFields = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fields } = req.body as { fields: { id: number; order: number }[] };
    const result = await orgService.reorderFields(fields);
    sendSuccess(res, result, 'Fields reordered');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

// Submissions
export const getReceivedSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const submissions = await orgService.getReceivedSubmissions(req.user.id);
    sendSuccess(res, submissions);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const data = await orgService.getOrgDashboard(req.user.id);
    sendSuccess(res, data);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const notifs = await orgService.getOrgNotifications(req.user.id);
    sendSuccess(res, notifs);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};
