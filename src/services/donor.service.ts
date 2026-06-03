import * as formRepo from '../repositories/form.repository';
import * as submissionRepo from '../repositories/submission.repository';
import * as donorRepo from '../repositories/donor.repository';
import * as notifRepo from '../repositories/notification.repository';

export const getAvailableForms = () => formRepo.findAllForms(true);

export const getFormDetails = (formId: number) => formRepo.findFormById(formId);

export const submitForm = async (
  formId: number,
  userId: number,
  answers: { fieldId: number; value: string }[],
) => {
  const form = await formRepo.findFormById(formId);
  if (!form) throw new Error('Form not found');
  if (!form.isPublished) throw new Error('This form is not available');

  // Validate required fields
  const required = form.fields.filter((f) => f.required);
  for (const field of required) {
    const answer = answers.find((a) => a.fieldId === field.id);
    if (!answer || !answer.value.trim()) {
      throw new Error(`Field "${field.label}" is required`);
    }
  }

  return submissionRepo.createSubmission(formId, userId, answers);
};

export const getDonorHistory = (userId: number) =>
  submissionRepo.findSubmissionsByUser(userId);

export const getDonorProfile = (userId: number) => donorRepo.findDonorByUserId(userId);

export const updateDonorProfile = (
  userId: number,
  data: { phone?: string; address?: string },
) => donorRepo.updateDonorProfile(userId, data);

export const getDonorNotifications = (userId: number) =>
  notifRepo.findNotificationsByUser(userId);

export const markNotificationRead = (id: number, userId: number) =>
  notifRepo.markAsRead(id, userId);

export const markAllNotificationsRead = (userId: number) => notifRepo.markAllAsRead(userId);
