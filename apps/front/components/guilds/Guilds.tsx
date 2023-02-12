import React from 'react';
import { getUserGuilds } from '../../utils/getters';
import { redirect } from 'next/navigation';
import Guild from './Guild';

const Guilds = async ({ user }) => {
   const guilds = await getUserGuilds(user as { email: string });
   if (!guilds.length) {
      redirect('/');
   }

   return (
      <div>
         {guilds.map((guild) => (
            <Guild key={guild.id} guild={guild} />
         ))}
      </div>
   );
};

export default Guilds;
