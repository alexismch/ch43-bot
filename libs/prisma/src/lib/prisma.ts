import { PrismaClient } from '../client';

export let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
   prismaInstance = new PrismaClient();
} else {
   if (!global.prismaInstance) {
      global.prismaInstance = new PrismaClient();
   }
   prismaInstance = global.prismaInstance;
}
