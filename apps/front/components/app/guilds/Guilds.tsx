import React from 'react';
import { getUserGuilds } from '../../../utils/getters';
import Guild from './Guild';
import Unauthorized from '../../errors/Unauthorized';
import Link from 'next/link';

const Guilds = async ({ user }) => {
   const guilds = await getUserGuilds(user as { email: string });
   if (!guilds.length) {
      return <Unauthorized />;
   }

   return (
      <div>
         <h1 className="mb-8 sm:mb-16 text-3xl sm:text-5xl font-bold text-light-primary dark:text-dark-primary">
            Your administrable guilds
         </h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
            {guilds.map((guild) => (
               <Guild key={guild.id} guild={guild} />
            ))}
            <div className="w-60 h-44 shadow-md bg-white dark:bg-dark-dark-grey rounded h-fit overflow-hidden flex justify-center items-center">
               <Link
                  href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot`}
                  target="_blank"
                  className="text-light-primary dark:text-dark-primary">
                  +
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Guilds;
