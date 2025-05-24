"use server";

import { PrismaClient } from '../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function createMetric(name: string, definition: string) {
  try {
    const metric = await prisma.metrics.create({
      data: { name, definition },
    });
    return { success: true, metric };
  } catch (error) {
    return { success: false, error: 'Metric already exists or error occurred.' };
  }
}

export async function getMetrics() {
  return await prisma.metrics.findMany();
}

export async function getMetricById(id: number) {
  return await prisma.metrics.findUnique({ where: { id } });
}

export async function updateMetric(id: number, data: { name?: string; definition?: string }) {
  try {
    const metric = await prisma.metrics.update({
      where: { id },
      data,
    });
    return { success: true, metric };
  } catch (error) {
    return { success: false, error: 'Metric not found or update error.' };
  }
}

export async function deleteMetric(id: number) {
  try {
    await prisma.metrics.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Metric not found or delete error.' };
  }
}