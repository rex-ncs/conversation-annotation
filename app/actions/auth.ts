"use server"

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function register(name: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { name, password: hashedPassword },
    });
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'User already exists or error occurred.' };
  }
}

export async function login(name: string, password: string) {
  const user = await prisma.users.findUnique({ where: { name } });
  if (!user) return { success: false, error: 'User not found.' };
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { success: false, error: 'Invalid password.' };
  (await cookies()).set('user', JSON.stringify({ id: user.id, name: user.name, role: user.role }));
  return { success: true, user: { id: user.id, name: user.name, role: user.role } };
}

export async function logout() {
  (await cookies()).delete('user');
  redirect('/')
}

export async function verify(name: string) {
  const user = await prisma.users.findUnique({ where: { name } });
  return !!user;
}

export async function getLoggedInUser() {
  const user = (await cookies()).get('user');
  if (!user) {
    return null;
  }
  const parsedUser = JSON.parse(user.value);
  const dbUser = await prisma.users.findUnique({ where: { id: parsedUser.id } });
  if (!dbUser) {
    return null;
  }
  return dbUser;
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const { success, error } = await register(name, password);
  if (!success) {
    return { error: error};
  }
  redirect('/')
}

export async function loginAction(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const { success, error } = await login(name, password);
  if (!success) {
    return { error: error};
  }
  redirect('/dashboard')
}