import { PrismaClient, Prisma, Role, UserRole } from "../lib/generated/prisma";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const metricData: Prisma.MetricsCreateInput[] = [
  {
    "name": "Handling Ambiguity",
    "definition": "Does the AI ask follow-up questions when user input is unclear?",
  },
  {
    "name": "Context Retention",
    "definition": "Can the AI maintain a coherent conversation without losing track of previous inputs?",
  },
  {
    "name": "Emotion Recognition",
    "definition": "Can the AI detect complex emotions beyond basic sentiment (e.g., frustration, sarcasm, anxiety)?" 
  },
  {
    "name": "Extraction",
    "definition": "Can the AI correctly extract key details (job roles, job listings, skills, etc. )?" 
  }
]

async function getUserData() {
  const hashedPassword = await bcrypt.hash('123', 10);
  return [
    {
      name: "Rex",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    {
      name: "Josey",
      password: hashedPassword,
      role: UserRole.USER,
    }
  ];
}

export async function main() {
  await prisma.annotation.deleteMany();
  await prisma.conversationMessages.deleteMany();
  await prisma.conversations.deleteMany();
  await prisma.metrics.deleteMany();
  await prisma.users.deleteMany();

  const userData = await getUserData();
  for (const u of userData) {
    await prisma.users.create({ data: u });
  }
  for (const m of metricData) {
    await prisma.metrics.create({ data: m });
  }
}

main();