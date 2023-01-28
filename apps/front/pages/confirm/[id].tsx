import { Verification } from '@prisma/client';
import {
   GetServerSideProps,
   GetServerSidePropsResult,
   InferGetServerSidePropsType,
   NextPage,
} from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import prisma from '../../utils/prisma';
import { getServerSideProps as userGetServerSideProps } from '../../utils/user';
import { useLogin } from '../../utils/login';

const Confirm: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ verification, user }) => {
   return (
      <>
         <Head>
            <title>Confirm Account - IPL BOT</title>
         </Head>
         {!user ? (
            <Unauthenticated />
         ) : (
            <Authenticated verification={verification} user={user} />
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
   verification,
   user,
}: {
   verification: Verification;
   user: { name: string };
}) => {
   const [message, setMessage] = useState<string>(
      'Verification in progress...',
   );

   useEffect(() => {
      fetch(`/api/verification/${verification.id}`, {
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
   }, [verification.id]);

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
   verification: Verification;
   user: {
      name: string;
   };
};

export const getServerSideProps: GetServerSideProps<
   ConfirmProps,
   ConfirmParams
> = async (context): Promise<GetServerSidePropsResult<ConfirmProps>> => {
   try {
      const verification = await prisma.verification.findFirst({
         where: {
            id: context.params?.id,
         },
      });
      if (!verification) {
         throw new Error();
      }

      const userProps: any = await userGetServerSideProps(context);

      return {
         ...userProps,
         props: {
            ...userProps.props,
            verification: verification as Verification,
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

export default Confirm;
