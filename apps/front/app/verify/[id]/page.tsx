import React from 'react';
import { notFound } from 'next/navigation';
import { getUserToVerify } from '../../../utils/getters';
import Unauthenticated from './Unauthenticated';
import Authenticated from './Authenticated';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic';

export const metadata = {
   title: 'Verify',
};

const Verify = async ({ params }) => {
   const { id } = params;

   const userToVerify = await getUserToVerify(id);
   if (!userToVerify || userToVerify.isVerified) {
      notFound();
   }

   const loggedInUser = (await getServerSession(authOptions))?.user;

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
