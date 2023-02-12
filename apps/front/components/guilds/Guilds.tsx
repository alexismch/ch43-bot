import React from 'react';
import { getUserGuilds } from '../../utils/getters';
import Guild from './Guild';
import { Unauthorized } from '../../utils/errors';

const Guilds = async ({ user }) => {
   const guilds = await getUserGuilds(user as { email: string });
   if (!guilds.length) {
      throw new Unauthorized();
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
