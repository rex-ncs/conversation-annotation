import { PrismaClient, Role } from '../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function createConversation(id: string, messages: { role: Role; content: string }[]) {
  try {
    const conversation = await prisma.conversations.create({
      data: {
        id,
        ConversationMessages: {
          create: messages.map((msg, idx) => ({
            role: msg.role,
            content: msg.content,
            turnNumber: idx + 1,
          })),
        },
      },
      include: { ConversationMessages: true },
    });
    return { success: true, conversation };
  } catch (error) {
    return { success: false, error: 'Conversation already exists or error occurred.' };
  }
}

export async function getConversations() {
  return await prisma.conversations.findMany({
    include: { ConversationMessages: true },
  });
}

export async function getConversationById(id: string) {
  return await prisma.conversations.findUnique({
    where: { id },
    include: { ConversationMessages: true },
  });
}

export async function deleteConversation(id: string) {
  try {
    await prisma.conversationMessages.deleteMany({ where: { conversationId: id } });
    await prisma.conversations.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Delete failed.' };
  }
}