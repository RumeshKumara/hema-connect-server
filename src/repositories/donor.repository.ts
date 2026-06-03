import prisma from '../lib/prisma';

export const findAllDonors = async () => {
  return prisma.donor.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findDonorByUserId = async (userId: number) => {
  return prisma.donor.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const createDonorProfile = async (userId: number, phone?: string, address?: string) => {
  return prisma.donor.create({
    data: { userId, phone, address },
  });
};

export const updateDonorProfile = async (
  userId: number,
  data: { phone?: string; address?: string },
) => {
  return prisma.donor.update({ where: { userId }, data });
};

export const deleteDonor = async (userId: number) => {
  return prisma.user.delete({ where: { id: userId } });
};

export const countDonors = async () => {
  return prisma.donor.count();
};
