import prisma from '../lib/prisma';
import { NotificationType } from '@prisma/client';

export const createNotification = async (
  userId: number,
  type: NotificationType,
  title: string,
  message: string,
) => {
  return prisma.notification.create({
    data: { userId, type, title, message },
  });
};

export const findNotificationsByUser = async (userId: number) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markAsRead = async (id: number, userId: number) => {
  return prisma.notification.update({
    where: { id, userId },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId: number) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const countUnread = async (userId: number) => {
  return prisma.notification.count({ where: { userId, isRead: false } });
};
