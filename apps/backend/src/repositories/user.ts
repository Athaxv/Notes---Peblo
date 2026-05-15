import { prisma } from "db"

export const UserRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        })
    },
    create(email: string, password: string) {
        return prisma.user.create({
            data: { email, password },
            select: { id: true, email: true, createdAt: true },
        });
    }
}