import { prismaInstance as prisma } from '@ch43-bot/prisma';

export const getUserToVerify = async (id: string) => {
   return prisma.user.findUnique({
      where: {
         id,
      },
      select: {
         id: true,
         isVerified: true,
      },
   });
};
