import { Guild } from 'discord.js';
import { prismaInstance as prisma } from '@ch43-bot/prisma';

export const guildDeleteHandler = async (guild: Guild) => {
   try {
      await prisma.guild.delete({
         where: {
            guildId: guild.id,
         },
      });
   } catch (e) {
      console.log('---');
      console.log(`guildDeleteHandler error ${guild.id} ${guild.name}`);
      console.log(e);
      console.log('---');
   }
};
