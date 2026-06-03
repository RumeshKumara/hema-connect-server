import prisma from '../lib/prisma';
import { SubmissionStatus } from '@prisma/client';

export interface AnswerInput {
  fieldId: number;
  value: string;
}

export const createSubmission = async (
  formId: number,
  userId: number,
  answers: AnswerInput[],
) => {
  return prisma.formSubmission.create({
    data: {
      formId,
      userId,
      answers: {
        create: answers.map((a) => ({ fieldId: a.fieldId, value: a.value })),
      },
    },
    include: {
      answers: { include: { field: true } },
      form: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const findAllSubmissions = async () => {
  return prisma.formSubmission.findMany({
    include: {
      form: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } },
      answers: { include: { field: { select: { label: true, type: true } } } },
    },
    orderBy: { submittedAt: 'desc' },
  });
};

export const findSubmissionsByUser = async (userId: number) => {
  return prisma.formSubmission.findMany({
    where: { userId },
    include: {
      form: { select: { id: true, title: true } },
      answers: { include: { field: { select: { label: true, type: true } } } },
    },
    orderBy: { submittedAt: 'desc' },
  });
};

export const findSubmissionsByForm = async (formId: number) => {
  return prisma.formSubmission.findMany({
    where: { formId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      answers: { include: { field: { select: { label: true, type: true } } } },
    },
    orderBy: { submittedAt: 'desc' },
  });
};

export const findSubmissionById = async (id: number) => {
  return prisma.formSubmission.findUnique({
    where: { id },
    include: {
      form: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } },
      answers: { include: { field: { select: { label: true, type: true } } } },
    },
  });
};

export const updateSubmissionStatus = async (
  id: number,
  status: SubmissionStatus,
  reviewNote?: string,
) => {
  return prisma.formSubmission.update({
    where: { id },
    data: { status, reviewNote, reviewedAt: new Date() },
  });
};

export const countSubmissions = async () => {
  return prisma.formSubmission.count();
};

export const countSubmissionsByStatus = async (status: SubmissionStatus) => {
  return prisma.formSubmission.count({ where: { status } });
};

export const getMonthlySubmissions = async () => {
  // Raw query for monthly grouping
  const result = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT DATE_FORMAT(submittedAt, '%Y-%m') as month, COUNT(*) as count
    FROM form_submissions
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `;
  return result.map((r) => ({ month: r.month, count: Number(r.count) }));
};
