import { PrismaClient } from '@prisma/client';
import { encryptionMiddleware } from './middlewares';

const initInstance = () => {
   const prismaInstance = new PrismaClient();
   prismaInstance.$use(encryptionMiddleware.use);
   return prismaInstance;
};

export let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
   prismaInstance ??= initInstance();
} else {
   global.prismaInstance ??= initInstance();
   prismaInstance = global.prismaInstance;
}
