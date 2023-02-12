'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Guild = ({ guild }) => {
   const { push } = useRouter();

   return (
      <div>
         <span>
            {guild.icon && (
               <Image
                  src={guild.icon}
                  alt={guild.name}
                  width={50}
                  height={50}
               />
            )}
         </span>
         <span>{guild.name}</span>
         <span>
            <button
               className="App-button"
               onClick={() => push(`/guilds/${guild.id}`)}>
               Details
            </button>
         </span>
      </div>
   );
};

export default Guild;
