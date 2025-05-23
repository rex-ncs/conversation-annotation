import { PrismaClient, Prisma } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UsersCreateInput[] = [
    {
        name: "Rex"
    }
]

const metricData: Prisma.MetricsCreateInput[] = [
  {
    "name": "Metric 1",
    "definition": "Description 1",
  },
  {
    "name": "Metric 2",
    "definition": "Description 2",
  }
]

export async function main() {
  await prisma.annotation.deleteMany();
  await prisma.conversationMessages.deleteMany();
  await prisma.conversations.deleteMany();
  await prisma.metrics.deleteMany();
  await prisma.users.deleteMany();

  for (const u of userData) {
    await prisma.users.create({ data: u });
  }
  for (const m of metricData) {
    await prisma.metrics.create({ data: m });
  }
}

main();