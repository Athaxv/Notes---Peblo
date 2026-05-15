import { prisma } from "db";

const userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const;

export const UserRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  create(data: { email: string; password: string; name?: string }) {
    return prisma.user.create({
      data,
      select: userSelect,
    });
  },
};
