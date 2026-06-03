import * as donorRepo from '../repositories/donor.repository';
import * as orgRepo from '../repositories/organization.repository';
import * as formRepo from '../repositories/form.repository';
import * as submissionRepo from '../repositories/submission.repository';
import { OrganizationStatus, SubmissionStatus } from '@prisma/client';
import * as notifRepo from '../repositories/notification.repository';

export const getDashboardStats = async () => {
  const [donors, organizations, forms, submissions, pending, approved] = await Promise.all([
    donorRepo.countDonors(),
    orgRepo.countOrganizations(),
    formRepo.countForms(),
    submissionRepo.countSubmissions(),
    submissionRepo.countSubmissionsByStatus(SubmissionStatus.PENDING),
    submissionRepo.countSubmissionsByStatus(SubmissionStatus.APPROVED),
  ]);

  const monthly = await submissionRepo.getMonthlySubmissions();

  return { donors, organizations, forms, submissions, pending, approved, monthly };
};

export const getAllDonors = () => donorRepo.findAllDonors();

export const getAllOrganizations = () => orgRepo.findAllOrganizations();

export const approveOrganization = (id: number) =>
  orgRepo.updateOrganizationStatus(id, OrganizationStatus.APPROVED);

export const rejectOrganization = (id: number) =>
  orgRepo.updateOrganizationStatus(id, OrganizationStatus.REJECTED);

export const getAllSubmissions = () => submissionRepo.findAllSubmissions();

export const reviewSubmission = async (
  id: number,
  status: SubmissionStatus,
  reviewNote?: string,
) => {
  const submission = await submissionRepo.updateSubmissionStatus(id, status, reviewNote);

  // Notify donor
  const notifTitle =
    status === SubmissionStatus.APPROVED ? 'Submission Approved' : 'Submission Rejected';
  const notifMessage =
    status === SubmissionStatus.APPROVED
      ? 'Your donation submission has been approved by the admin.'
      : `Your donation submission has been rejected. ${reviewNote ?? ''}`;

  await notifRepo.createNotification(
    submission.userId,
    status === SubmissionStatus.APPROVED ? 'SUBMISSION_APPROVED' : 'SUBMISSION_REJECTED',
    notifTitle,
    notifMessage,
  );

  return submission;
};

export const deleteDonorById = (userId: number) => donorRepo.deleteDonor(userId);
export const deleteOrgById = (userId: number) => orgRepo.deleteOrganization(userId);
