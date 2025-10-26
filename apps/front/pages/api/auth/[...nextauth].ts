import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

const isProduction = process.env.NODE_ENV === 'production';

export const authOptions = {
   providers: [
      AzureADProvider({
         clientId: process.env.AZURE_CLIENT_ID as string,
         clientSecret: process.env.AZURE_CLIENT_SECRET as string,
         tenantId: process.env.AZURE_TENANT_ID as string,
      }),
   ],
   debug: !isProduction,
   useSecureCookies: isProduction,
};
export default NextAuth(authOptions);
