import * as Crypto from 'crypto';
import * as process from 'process';

export class CryptoUtils {
   private static ENCRYPTION_ALGORITHM = 'aes-256-cbc' as const;
   private static HASH_ALGORITHM = 'sha512' as const;

   /**
    * Encrypt a string
    */
   static encrypt(from: string): string {
      // Initialization vector
      const iv = Crypto.randomBytes(16);
      const cipher = Crypto.createCipheriv(
         CryptoUtils.ENCRYPTION_ALGORITHM,
         Buffer.from(process.env.CRYPT_KEY as string, 'binary'),
         iv,
      );
      let encrypted = cipher.update(from, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
   }

   /**
    * Decrypt a string
    */
   static decrypt(from: string): string {
      const encryptedData = from.split(':');
      const iv = Buffer.from(encryptedData[0], 'hex');
      const decipher = Crypto.createDecipheriv(
         CryptoUtils.ENCRYPTION_ALGORITHM,
         Buffer.from(process.env.CRYPT_KEY as string, 'binary'),
         iv,
      );
      const decrypted = decipher.update(encryptedData[1], 'hex', 'utf-8');
      return decrypted + decipher.final('utf-8');
   }

   /**
    * Hash a string with additional values
    */
   static hash(value: string, additionalValues?: string[]): string {
      const hmac = Crypto.createHmac(
         CryptoUtils.HASH_ALGORITHM,
         Buffer.from(process.env.HASH_KEY as string, 'binary'),
      );

      // Values array
      let values: string[] = [];
      if (Array.isArray(additionalValues)) {
         values = additionalValues.slice(0);
      }
      values.push(value);

      let result = '';
      for (let i = 0; i < values.length; i++) {
         const element = values[i];

         // Some Random
         for (let j = 0; j < element.length; j++) {
            const char = element.charAt(j);
            const code = element.charCodeAt(j);

            // Put to lowercase if even, otherwise uppercase
            if (code % 2 === 0) {
               result += char.toLowerCase();
            } else {
               result += char.toUpperCase();
            }
         }
      }
      hmac.update(result.replace(' ', ''));
      return hmac.digest('hex');
   }
}
