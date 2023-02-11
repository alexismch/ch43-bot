import React from 'react';
import App from './App';
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
         <App user={user} />
      </>
   );
};

export default Home;
