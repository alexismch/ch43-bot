import { Prisma } from '@prisma/client';

export interface PrismaMiddleware {
   use(params: Prisma.MiddlewareParams, next);
}
