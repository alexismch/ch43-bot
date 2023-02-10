import { cookies } from 'next/headers';

export const getUser = async () => {
   const sessionCookie = cookies().get('session');
   if (!sessionCookie) {
      return null;
   }

   const res = await fetch(`${process.env.FRONT_URL}/api/auth/user`, {
      headers: {
         Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
      next: {
         revalidate: 60,
      },
   });
   if (!res.ok) {
      return null;
   }

   return res.json();
};
