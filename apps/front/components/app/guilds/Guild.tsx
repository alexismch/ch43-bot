'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Guild = ({ guild }) => {
   return (
      <div className="w-60 h-44 shadow-md bg-white dark:bg-dark-dark-grey rounded h-fit overflow-hidden flex flex-col justify-between">
         {guild.icon && (
            <Image
               src={guild.icon}
               alt={guild.name}
               width={50}
               height={50}
               className="rounded-full mx-auto mt-4"
            />
         )}
         <p className="w-max text-xl mx-auto text-light-black dark:text-dark-white">
            {guild.name}
         </p>
         <Link
            href={`/guilds/${guild.id}`}
            className="block w-full bg-none px-3.5 py-2.5 text-sm font-semibold text-light-primary dark:text-dark-primary border-t-[1px] border-light-primary dark:border-dark-primary hover:bg-light-primary dark:hover:bg-dark-primary hover:text-light-white dark:hover:text-dark-dark-grey">
            Details
         </Link>
      </div>
   );
};

export default Guild;
