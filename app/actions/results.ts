import prisma from "@/lib/prisma";

export async function getAllMetrics() {
  return prisma.metrics.findMany({ orderBy: { name: "asc" } });
}

export async function getAllUsers() {
  return prisma.users.findMany({ orderBy: { name: "asc" } });
}

export async function getPaginatedConversationsWithAnnotations(metricId: number, page: number = 1, pageSize: number = 10) {
  // Get conversations with annotations for the given metric
  const skip = (page - 1) * pageSize;
  const conversations = await prisma.conversations.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      Annotation: {
        where: { metricId },
        include: { user: true },
      },
    },
  });
  const total = await prisma.conversations.count();
  return { conversations, total };
}
