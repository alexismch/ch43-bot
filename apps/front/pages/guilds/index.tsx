import {
   GetServerSideProps,
   InferGetServerSidePropsType,
   NextPage,
} from 'next';
import Head from 'next/head';
import React from 'react';
import { prismaInstance as prisma } from '@ch43-bot/prisma';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/config/session';
import { REST, Routes, Guild as DiscordGuild } from 'discord.js';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Guilds: NextPage<
   InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, guilds }) => {
   const { push } = useRouter();

   return (
      <>
         <Head>
            <title>Guilds- Ch43 Bot</title>
         </Head>
         <div>
            {guilds.map((guild) => (
               <div key={guild.id}>
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
                        onClick={() =>
                           push({ pathname: `/guilds/${guild.id}` })
                        }>
                        Details
                     </button>
                  </span>
               </div>
            ))}
         </div>
      </>
   );
};

type Guild = {
   id: string;
   guildId: string;
   name: string;
   icon?: string;
};

type GuildsProps = {
   user: {
      name: string;
   };
   guilds: Guild[];
};

export const getServerSideProps: GetServerSideProps<GuildsProps> =
   withIronSessionSsr<GuildsProps>(async ({ req }) => {
      const user = req.session.user;
      if (!user) {
         return {
            redirect: {
               destination: '/',
               permanent: false,
            },
         };
      }

      const dbGuilds = await prisma.guild.findMany({
         where: {
            users: {
               some: {
                  email: user.email,
               },
            },
         },
         select: {
            id: true,
            guildId: true,
         },
      });
      if (!dbGuilds.length) {
         return {
            redirect: {
               destination: '/',
               permanent: false,
            },
         };
      }

      const rest = new REST({ version: '10' }).setToken(
         process.env.DISCORD_TOKEN as string,
      );

      const guilds: Guild[] = [];
      for (let i = 0; i < dbGuilds.length; i++) {
         const dbGuild = dbGuilds[i];
         const guild = (await rest.get(
            Routes.guild(dbGuild.guildId),
         )) as DiscordGuild;

         guilds.push({
            id: dbGuild.id,
            guildId: dbGuild.guildId,
            name: guild.name,
            icon: guild.icon ? rest.cdn.icon(guild.id, guild.icon) : undefined,
         });
      }

      return {
         props: {
            user,
            guilds,
         },
      };
   }, sessionOptions);

export default Guilds;
