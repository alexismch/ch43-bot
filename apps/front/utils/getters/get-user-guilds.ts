import 'server-only';

import { prismaInstance as prisma } from '@ch43-bot/prisma';
import { Guild as DiscordGuild, REST, Routes } from 'discord.js';

export type Guild = {
   id: string;
   guildId: string;
   name: string;
   icon?: string;
};

export const getUserGuilds = async (user: {
   email: string;
}): Promise<Guild[]> => {
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
      return [];
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

   return guilds;
};
