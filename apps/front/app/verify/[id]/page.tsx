import React from 'react';
import { prismaInstance as prisma } from '@ch43-bot/prisma';
import { notFound } from 'next/navigation';
import { getUser as getLoggedInUser } from '../../../utils/getters';
import Unauthenticated from './Unauthenticated';
import Authenticated from './Authenticated';

export const metadata = {
   title: 'Verify',
};

const getUserToVerify = async (id: string) => {
   return prisma.user.findUnique({
      where: {
         id,
      },
      select: {
         id: true,
         isVerified: true,
      },
   });
};

const Verify = async ({ params: { id } }) => {
   const userToVerify = await getUserToVerify(id);
   if (!userToVerify || userToVerify.isVerified) {
      notFound();
   }

   const loggedInUser = await getLoggedInUser();

   return (
      <div>
         {loggedInUser ? (
            <Authenticated userId={userToVerify.id} user={loggedInUser} />
         ) : (
            <Unauthenticated />
         )}
      </div>
   );
};

export default Verify;
