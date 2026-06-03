import * as orgRepo from '../repositories/organization.repository';
import * as formRepo from '../repositories/form.repository';
import * as submissionRepo from '../repositories/submission.repository';
import * as donationRequestRepo from '../repositories/donation-request.repository';
import * as notifRepo from '../repositories/notification.repository';
import { FormFieldInput } from '../repositories/form.repository';

export const getOrganizationProfile = (userId: number) =>
  orgRepo.findOrganizationByUserId(userId);

export const updateOrganizationProfile = (
  userId: number,
  data: {
    organizationName?: string;
    location?: string;
    contactNumber?: string;
    description?: string;
  },
) => orgRepo.updateOrganizationProfile(userId, data);

// Donation Requests
export const createDonationRequest = async (
  userId: number,
  data: {
    title: string;
    description?: string;
    requiredCount?: number;
    requiredDate?: Date;
    location?: string;
    contactNumber?: string;
  },
) => {
  const org = await orgRepo.findOrganizationByUserId(userId);
  if (!org) throw new Error('Organization profile not found');
  if (org.status !== 'APPROVED') throw new Error('Organization must be approved to create requests');

  return donationRequestRepo.createDonationRequest({ organizationId: org.id, ...data });
};

export const getMyDonationRequests = async (userId: number) => {
  const org = await orgRepo.findOrganizationByUserId(userId);
  if (!org) throw new Error('Organization profile not found');
  return donationRequestRepo.findDonationRequestsByOrganization(org.id);
};

export const publishDonationRequest = (id: number, isPublished: boolean) =>
  donationRequestRepo.updateDonationRequest(id, { isPublished });

export const deleteDonationRequest = (id: number) =>
  donationRequestRepo.deleteDonationRequest(id);

// Form management by org
export const createForm = async (userId: number, title: string, description?: string, fields?: FormFieldInput[]) => {
  return formRepo.createForm({ title, description, createdById: userId, fields });
};

export const getMyForms = async (userId: number) => {
  const all = await formRepo.findAllForms();
  return all.filter((f) => f.createdById === userId);
};

export const publishForm = (formId: number, isPublished: boolean) =>
  formRepo.updateForm(formId, { isPublished });

export const addFieldToForm = (formId: number, field: FormFieldInput) =>
  formRepo.addFormField(formId, field);

export const removeFieldFromForm = (fieldId: number) =>
  formRepo.deleteFormField(fieldId);

export const reorderFields = (fields: { id: number; order: number }[]) =>
  formRepo.reorderFormFields(fields);

// Submissions received by org
export const getReceivedSubmissions = async (userId: number) => {
  const org = await orgRepo.findOrganizationByUserId(userId);
  if (!org) throw new Error('Organization profile not found');

  const forms = await formRepo.findAllForms();
  const myForms = forms.filter((f) => f.createdById === userId);

  const allSubmissions = await Promise.all(
    myForms.map((f) => submissionRepo.findSubmissionsByForm(f.id)),
  );
  return allSubmissions.flat();
};

export const getOrgDashboard = async (userId: number) => {
  const org = await orgRepo.findOrganizationByUserId(userId);
  if (!org) throw new Error('Organization profile not found');

  const [requests, submissions] = await Promise.all([
    donationRequestRepo.findDonationRequestsByOrganization(org.id),
    submissionRepo.findSubmissionsByForm(org.id),
  ]);

  return {
    organization: org,
    totalRequests: requests.length,
    publishedRequests: requests.filter((r) => r.isPublished).length,
    totalSubmissions: submissions.length,
  };
};

export const getOrgNotifications = (userId: number) =>
  notifRepo.findNotificationsByUser(userId);
