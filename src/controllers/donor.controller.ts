import { Request, Response } from 'express';
import * as donorService from '../services/donor.service';
import { sendSuccess, sendError } from '../utils/response';

export const getForms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const forms = await donorService.getAvailableForms();
    sendSuccess(res, forms, 'Available forms fetched');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getFormDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await donorService.getFormDetails(Number(req.params.id));
    if (!form) { sendError(res, 'Form not found', 404); return; }
    sendSuccess(res, form);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const submitForm = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }

    const { formId, answers } = req.body as {
      formId: number;
      answers: { fieldId: number; value: string }[];
    };

    if (!formId || !answers || !Array.isArray(answers)) {
      sendError(res, 'formId and answers array are required', 400);
      return;
    }

    const submission = await donorService.submitForm(formId, req.user.id, answers);
    sendSuccess(res, submission, 'Form submitted successfully', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 400);
  }
};

export const getDonationHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const history = await donorService.getDonorHistory(req.user.id);
    sendSuccess(res, history, 'Donation history fetched');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getDonorProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const profile = await donorService.getDonorProfile(req.user.id);
    sendSuccess(res, profile);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const updateDonorProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const { phone, address } = req.body as { phone?: string; address?: string };
    const profile = await donorService.updateDonorProfile(req.user.id, { phone, address });
    sendSuccess(res, profile, 'Profile updated');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const notifs = await donorService.getDonorNotifications(req.user.id);
    sendSuccess(res, notifs);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    await donorService.markNotificationRead(Number(req.params.id), req.user.id);
    sendSuccess(res, null, 'Notification marked as read');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    await donorService.markAllNotificationsRead(req.user.id);
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 500);
  }
};
