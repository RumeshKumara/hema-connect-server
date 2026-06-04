import admin from '../config/firebase';
import * as userRepo from '../repositories/user.repository';
import { Role } from '@prisma/client';

/**
 * Called after first Firebase login to sync the Firebase user into the local DB.
 * If the user already exists, returns the existing record.
 * Also applies the stored DB role back as a Firebase Custom Claim.
 */
export const syncUser = async (uid: string, email: string, name: string) => {
  let user = await userRepo.findUserByFirebaseUid(uid);

  if (!user) {
    // First-time login: create a local DB record with default role DONOR
    user = await userRepo.createFirebaseUser({ uid, email, name });
  }

  // Keep Firebase Custom Claim in sync with DB role
  await admin.auth().setCustomUserClaims(uid, { role: user.role });

  return user;
};

/**
 * Fetch the current user's profile from the local DB using their Firebase UID.
 */
export const getMe = async (uid: string) => {
  return userRepo.findUserByFirebaseUid(uid);
};

/**
 * Assign a role to a user (admin-only operation).
 * Updates both the local DB and the Firebase Custom Claim.
 */
export const assignRole = async (uid: string, role: Role) => {
  const user = await userRepo.updateUserRole(uid, role);
  await admin.auth().setCustomUserClaims(uid, { role });
  return user;
};
