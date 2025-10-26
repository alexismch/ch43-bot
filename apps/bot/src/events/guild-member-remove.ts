import { GuildMember, PartialGuildMember } from 'discord.js';

import { prismaInstance as prisma } from '@ch43-bot/prisma';

export const guildMemberRemoveHandler = async (
   guildMember: GuildMember | PartialGuildMember,
) => {
   try {
      try {
         await guildMember.deleteDM();
      } catch {
         // ignore
      }

      await prisma.user.delete({
         where: {
            guildId_userId: {
               guildId: guildMember.guild.id,
               userId: guildMember.user?.id,
            },
         },
      });
   } catch (e) {
      console.log('---');
      console.log(
         `guildMemberRemoveHandler error ${guildMember.id} ${guildMember.nickname}`,
      );
      console.log(e);
      console.log('---');
   }
};
