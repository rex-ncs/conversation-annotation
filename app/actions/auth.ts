import { PrismaClient } from '../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function register(name: string) {
  try {
    const user = await prisma.users.create({
      data: { name },
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'User already exists or error occurred.' };
  }
}

export async function login(name: string) {
  const user = await prisma.users.findUnique({ where: { name } });
  if (!user) return { success: false, error: 'User not found.' };
  return { success: true, user };
}

export async function verify(name: string) {
  const user = await prisma.users.findUnique({ where: { name } });
  return !!user;
}