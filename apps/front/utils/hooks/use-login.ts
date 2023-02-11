import { useRouter, usePathname } from 'next/navigation';

export const useLogin = () => {
   const { push } = useRouter();
   const origin = usePathname();

   const login = () =>
      window.location.replace(`/api/auth/login?origin=${origin}`);
   const logout = () => push(`/api/auth/logout?origin=${origin}`);

   return {
      login,
      logout,
   };
};
