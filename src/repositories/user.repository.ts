import prisma from '../lib/prisma';
import { Role } from '@prisma/client';

export interface FirebaseUserInput {
  uid: string;    // Firebase UID
  email: string;
  name: string;
  role?: Role;
}

/**
 * Find a user by their Firebase UID.
 */
export const findUserByFirebaseUid = async (uid: string) => {
  return prisma.user.findUnique({
    where: { firebaseUid: uid },
    select: { id: true, firebaseUid: true, name: true, email: true, role: true, createdAt: true },
  });
};

/**
 * Find a user by email.
 */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, firebaseUid: true, name: true, email: true, role: true, createdAt: true },
  });
};

/**
 * Create a new user record linked to a Firebase UID (no password stored).
 */
export const createFirebaseUser = async (input: FirebaseUserInput) => {
  return prisma.user.create({
    data: {
      firebaseUid: input.uid,
      email: input.email,
      name: input.name,
      role: input.role ?? 'DONOR',
    },
    select: { id: true, firebaseUid: true, name: true, email: true, role: true, createdAt: true },
  });
};

/**
 * Update a user's role by Firebase UID.
 */
export const updateUserRole = async (uid: string, role: Role) => {
  return prisma.user.update({
    where: { firebaseUid: uid },
    data: { role },
    select: { id: true, firebaseUid: true, name: true, email: true, role: true, createdAt: true },
  });
};
