import prisma from '../lib/prisma';
import { OrganizationStatus } from '@prisma/client';

export const findAllOrganizations = async () => {
  return prisma.organization.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findOrganizationByUserId = async (userId: number) => {
  return prisma.organization.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const findOrganizationById = async (id: number) => {
  return prisma.organization.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const createOrganizationProfile = async (
  userId: number,
  data: {
    organizationName: string;
    location?: string;
    contactNumber?: string;
    description?: string;
  },
) => {
  return prisma.organization.create({ data: { userId, ...data } });
};

export const updateOrganizationStatus = async (id: number, status: OrganizationStatus) => {
  return prisma.organization.update({ where: { id }, data: { status } });
};

export const updateOrganizationProfile = async (
  userId: number,
  data: {
    organizationName?: string;
    location?: string;
    contactNumber?: string;
    description?: string;
  },
) => {
  return prisma.organization.update({ where: { userId }, data });
};

export const deleteOrganization = async (userId: number) => {
  return prisma.user.delete({ where: { id: userId } });
};

export const countOrganizations = async () => {
  return prisma.organization.count();
};
