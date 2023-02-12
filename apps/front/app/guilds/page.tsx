import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import Guilds from '../../components/guilds/Guilds';
import { Unauthorized } from '../../utils/errors';

export const dynamic = 'force-dynamic';

const GuildsPage = async () => {
   const user = (await getServerSession(authOptions))?.user;
   if (!user) {
      throw new Unauthorized();
   }

   return (
      <Suspense fallback={<div>Loading...</div>}>
         {/* @ts-expect-error waiting for TypeScript fix */}
         <Guilds user={user} />
      </Suspense>
   );
};

export default GuildsPage;
