import { useRouter } from 'next/router';

export const useLogin = () => {
   const { push, asPath } = useRouter();

   const logAction = (action: 'in' | 'out') =>
      push({
         pathname: `/auth/log${action}`,
         query: {
            origin: asPath,
         },
      });
   const login = () => logAction('in');
   const logout = () => logAction('out');

   return {
      login,
      logout,
   };
};
