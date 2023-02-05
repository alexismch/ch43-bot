import type { InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { getServerSideProps } from '../utils/user';
import { useLogin } from '../utils/login';

const Home: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
   const { login, logout } = useLogin();

   return (
      <>
         <Head>
            <title>Home - Ch43 Bot</title>
         </Head>
         <p>Welcome to Ch43 Bot</p>
         <span className="App-title">
            {!user ? (
               <button className="App-button" onClick={login}>
                  LOGIN
               </button>
            ) : (
               <>
                  {user.name}
                  <p>
                     <button className="App-button" onClick={logout}>
                        LOGOUT
                     </button>
                  </p>
               </>
            )}
         </span>
      </>
   );
};

export { getServerSideProps };

export default Home;
