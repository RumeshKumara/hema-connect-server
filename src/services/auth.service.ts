import * as userRepo from '../repositories/user.repository';
import { signToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: Role,
) => {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error('Email already in use');

  const user = await userRepo.createUser({ name, email, password, role });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const valid = await userRepo.validatePassword(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getMe = async (id: number) => {
  return userRepo.findUserById(id);
};
