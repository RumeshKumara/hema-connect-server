import prisma from '../lib/prisma';

export interface DonationRequestInput {
  organizationId: number;
  title: string;
  description?: string;
  requiredCount?: number;
  requiredDate?: Date;
  location?: string;
  contactNumber?: string;
}

export const createDonationRequest = async (input: DonationRequestInput) => {
  return prisma.donationRequest.create({ data: input });
};

export const findAllDonationRequests = async (publishedOnly = false) => {
  return prisma.donationRequest.findMany({
    where: publishedOnly ? { isPublished: true } : {},
    include: {
      organization: {
        select: { id: true, organizationName: true, location: true, contactNumber: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findDonationRequestById = async (id: number) => {
  return prisma.donationRequest.findUnique({
    where: { id },
    include: {
      organization: { select: { id: true, organizationName: true, location: true } },
    },
  });
};

export const findDonationRequestsByOrganization = async (organizationId: number) => {
  return prisma.donationRequest.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateDonationRequest = async (
  id: number,
  data: Partial<DonationRequestInput> & { isPublished?: boolean },
) => {
  return prisma.donationRequest.update({ where: { id }, data });
};

export const deleteDonationRequest = async (id: number) => {
  return prisma.donationRequest.delete({ where: { id } });
};
