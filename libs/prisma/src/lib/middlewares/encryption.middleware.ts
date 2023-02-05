import { PrismaMiddleware } from './prisma.middleware';
import { Prisma } from '@prisma/client';
import { isArray } from 'class-validator';
import { CryptoUtils } from '@ch43-bot/utils';
import { ENCRYPTED_PROPS } from '../prisma.config';

class EncryptionMiddleware implements PrismaMiddleware {
   async use(params: Prisma.MiddlewareParams, next) {
      EncryptionMiddleware.encrypt(params.args);
      const result = await next(params);
      EncryptionMiddleware.decrypt(result);
      return result;
   }

   private static encrypt(source, onlyKeepHash = false) {
      if (!source) {
         return source;
      } else if (isArray(source)) {
         const encryptedObjects = [];

         for (let i = 0; i < source.length; i++) {
            encryptedObjects.push(this.encrypt(source[i], onlyKeepHash));
         }

         return encryptedObjects;
      } else {
         const keys = Object.keys(source);

         for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const propOnlyKeepHash = onlyKeepHash || key === 'where';
            const prop = source[key];

            if (prop === null || prop === undefined) {
               source[key] = prop;
            } else if (ENCRYPTED_PROPS[key]) {
               source[key] = CryptoUtils.encrypt(prop);
               if (ENCRYPTED_PROPS[key].hasBidx) {
                  source[`${key}_bidx`] = CryptoUtils.hash(prop);
               }
               if (propOnlyKeepHash) {
                  delete source[key];
               }
            } else if (typeof prop === 'object') {
               source[key] = this.encrypt(prop, propOnlyKeepHash);
            }
         }

         return source;
      }
   }

   private static decrypt(source) {
      if (!source) {
         return source;
      } else if (isArray(source)) {
         const decryptedObjects = [];

         for (let i = 0; i < source.length; i++) {
            decryptedObjects.push(this.decrypt(source[i]));
         }

         return decryptedObjects;
      } else {
         const keys = Object.keys(source);

         for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const prop = source[keys[i]];

            if (prop === null || prop === undefined) {
               source[key] = prop;
            } else if (ENCRYPTED_PROPS[key]) {
               source[key] = CryptoUtils.decrypt(prop);
               if (ENCRYPTED_PROPS[key].hasBidx) {
                  delete source[`${key}_bidx`];
               }
            } else if (typeof prop === 'object') {
               source[keys[i]] = this.decrypt(prop);
            }
         }

         return source;
      }
   }
}

export const encryptionMiddleware = new EncryptionMiddleware();
