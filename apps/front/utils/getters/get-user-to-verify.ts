import 'server-only';

import { prismaInstance as prisma } from '@ch43-bot/prisma';
import { isMongoId } from 'class-validator';

export const getUserToVerify = async (id: string) => {
   if (!isMongoId(id)) {
      return null;
   }

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
