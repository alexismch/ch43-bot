import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Guilds from '../../components/app/guilds/Guilds';
import Unauthorized from '../../components/errors/Unauthorized';

export const dynamic = 'force-dynamic';

const GuildsPage = async () => {
   const user = (await getServerSession(authOptions))?.user;
   if (!user) {
      return <Unauthorized />;
   }

   return (
      <>
         {/* @ts-expect-error waiting for TypeScript fix */}
         <Guilds user={user} />
      </>
   );
};

export default GuildsPage;
