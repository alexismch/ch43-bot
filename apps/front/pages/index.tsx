import type { InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { getServerSideProps } from '../utils/user';

const Home: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
   const { pathname, push } = useRouter();

   const logAction = (action: 'in' | 'out') =>
      push({
         pathname: `/auth/log${action}`,
         query: {
            origin: pathname,
         },
      });
   const login = () => logAction('in');
   const logout = () => logAction('out');

   return (
      <>
         <Head>
            <title>Home - Ch43 Bot</title>
         </Head>
         <p>Welcome to IPL BOT</p>
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
