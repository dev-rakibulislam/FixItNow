import { prisma } from "../lib/prisma";

export const existingUser = async (email: string) =>
  await prisma.user.findUnique({ where: { email } });
