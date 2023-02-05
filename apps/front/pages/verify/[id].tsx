import {
   GetServerSideProps,
   GetServerSidePropsResult,
   InferGetServerSidePropsType,
   NextPage,
} from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { prismaInstance as prisma } from '@ch43-bot/prisma';
import { getServerSideProps as userGetServerSideProps } from '../../utils/user';
import { useLogin } from '../../utils/login';

const Verify: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ userId, user }) => {
   return (
      <>
         <Head>
            <title>Confirm Account - Ch43 Bot</title>
         </Head>
         {!user ? (
            <Unauthenticated />
         ) : (
            <Authenticated userId={userId} user={user} />
         )}
      </>
   );
};

const Unauthenticated = () => {
   const { login } = useLogin();

   return (
      <>
         <p>Click on the button below in order to complete the verification</p>
         <button className="App-button" onClick={login}>
            CONFIRM
         </button>
      </>
   );
};

const Authenticated = ({
   userId,
   user,
}: {
   userId: string;
   user: { name: string };
}) => {
   const [message, setMessage] = useState<string>(
      'Verification in progress...',
   );

   useEffect(() => {
      fetch(`/api/users/${userId}/verify`, {
         method: 'PATCH',
      })
         .then((r) => {
            if (r.status !== 204) {
               return r.json();
            }
            setMessage('Thanks for having completed the verification');
         })
         .then((body: { message: string } | undefined) => {
            if (!body) {
               return;
            }
            if (!body.message) {
               throw new Error();
            }
            setMessage(body.message);
         })
         .catch((e) => {
            console.log(e);
            setMessage('An error occurred during the verification');
         });
   }, [userId]);

   return (
      <>
         <p>{message}</p>
         <span className="App-title">{user.name}</span>
      </>
   );
};

type ConfirmParams = {
   id: string;
};

type ConfirmProps = {
   userId: string;
   user: {
      name: string;
   };
};

export const getServerSideProps: GetServerSideProps<
   ConfirmProps,
   ConfirmParams
> = async (context): Promise<GetServerSidePropsResult<ConfirmProps>> => {
   try {
      const user = await prisma.user.findUnique({
         where: {
            id: context.params?.id,
         },
         select: {
            id: true,
            isVerified: true,
         },
      });
      if (!user || user.isVerified) {
         throw new Error();
      }

      const userProps: any = await userGetServerSideProps(context);

      return {
         ...userProps,
         props: {
            ...userProps.props,
            userId: user.id,
         },
      };
   } catch {
      return {
         redirect: {
            destination: '/',
            permanent: false,
         },
      };
   }
};

export default Verify;
