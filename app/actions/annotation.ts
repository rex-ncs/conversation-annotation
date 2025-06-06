"use server";
import { Verdict } from '../../lib/generated/prisma';
import prisma from '../../lib/prisma';

// Create an annotation
export async function createAnnotation(data: {
  userId: number;
  conversationId: string;
  metricId: number;
  verdict: Verdict;
  comments?: string;
}) {
  try {
    const annotation = await prisma.annotation.create({ data });
    return { success: true, annotation };
  } catch (error) {
    return { success: false, error: 'Annotation already exists or error occurred.' };
  }
}

// Read all annotations
export async function getAnnotations() {
  return await prisma.annotation.findMany();
}

// Read a single annotation by ID
export async function getAnnotationById(id: number) {
  return await prisma.annotation.findUnique({ where: { id } });
}

// Update verdict and comments only
export async function updateAnnotation(data: {
  userId: number;
  conversationId: string;
  metricId: number;
  verdict: Verdict;
  comments?: string;
}) {
  try {
    const annotation = await prisma.annotation.update({
      where: { 
        annotations_user_conversation_metric_unique: {
          userId: data.userId,
          conversationId: data.conversationId,
          metricId: data.metricId,
        }
      },

      data: {
        verdict: data.verdict,
        comments: data.comments,
      },
    });
    return { success: true, annotation };
  } catch (error) {
    return { success: false, error: 'Annotation not found or update error.' };
  }
}

// Delete an annotation
export async function deleteAnnotation(id: number) {
  try {
    await prisma.annotation.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Annotation not found or delete error.' };
  }
}

// Fetch all annotations with related conversation and metric info
export async function getAnnotationsWithDetails(userId?: number) {
  return await prisma.annotation.findMany({
    where: userId ? { userId } : undefined,
    include: {
      conversation: true,
      metric: true,
    },
    orderBy: { id: 'desc' },
  });
}

export async function getAnnotation({ userId, conversationId, metricId }: { userId: number, conversationId: string, metricId: number }) {
    return await prisma.annotation.findFirst({
        where: {
            userId,
            conversationId,
            metricId,
        },
    });
}

export async function getUnannotatedConversationsForUserAndMetric(userId: number, metricId: number) {
  return await prisma.conversations.findMany({
    where: {
      Annotation: {
        none: {
          userId,
          metricId,
        },
      },
    },
    include: {
      ConversationMessages: true,
    },
  });
}

export async function getAnnotationsByMetricWithDetails(metricId: number) {
  return await prisma.annotation.findMany({
    where: { metricId },
    include: {
      conversation: true,
      user: true,
    },
    orderBy: { conversationId: 'asc' },
  });
}