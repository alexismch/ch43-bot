import React from 'react';
import App from './App';
import { getUser } from '../utils/getters';

export const metadata = {
   title: 'Home',
};

const Home = async () => {
   const user = await getUser();

   return (
      <>
         <p>Welcome to Ch43 Bot</p>
         <App user={user} />
      </>
   );
};

export default Home;
