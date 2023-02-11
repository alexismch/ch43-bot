import React from 'react';
import { notFound } from 'next/navigation';
import {
   getUser as getLoggedInUser,
   getUserToVerify,
} from '../../../utils/getters';
import Unauthenticated from './Unauthenticated';
import Authenticated from './Authenticated';

export const dynamic = 'force-dynamic';

export const metadata = {
   title: 'Verify',
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
