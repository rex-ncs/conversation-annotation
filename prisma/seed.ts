import { PrismaClient, Prisma } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UsersCreateInput[] = [
    {
        name: "Rex"
    }
]

export async function main() {
  for (const u of userData) {
    await prisma.users.create({ data: u });
  }
}

main();