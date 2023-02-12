import React from 'react';
import Unauthenticated from '../components/Unauthenticated';
import Authenticated from '../components/Authenticated';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export const metadata = {
   title: 'Home',
};

const Home = async () => {
   const user = (await getServerSession(authOptions))?.user;

   return (
      <>
         <p>Welcome to Ch43 Bot</p>
         <span className="text-light-primary dark:text-dark-primary">
            {!user ? <Unauthenticated /> : <Authenticated user={user} />}
         </span>
      </>
   );
};

export default Home;
