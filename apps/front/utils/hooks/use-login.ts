import { signIn, signOut } from 'next-auth/react';

export const useLogin = () => {
   const login = () => signIn('azure-ad');
   const logout = () => signOut();

   return {
      login,
      logout,
   };
};
