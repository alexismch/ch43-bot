import { Prisma } from '../../client';

export interface PrismaMiddleware {
   use(params: Prisma.MiddlewareParams, next);
}
