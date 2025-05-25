"use server"

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

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
  (await cookies()).set('user', JSON.stringify(user));
  return { success: true, user };
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
    return null
  };
  const parsedUser = JSON.parse(user.value);
  const dbUser = await prisma.users.findUnique({ where: { id: parsedUser.id } });
  if (!dbUser) {
    (await cookies()).delete('user');
    return null
  }
  return dbUser;
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const { success, error } = await register(name);
  if (!success) {
    return { error: error};
  }
  redirect('/')
}

export async function loginAction(formData: FormData) {
  const name = formData.get("name") as string;
  const { success, error } = await login(name);
  if (!success) {
    return { error: error};
  }
  redirect('/dashboard')
}