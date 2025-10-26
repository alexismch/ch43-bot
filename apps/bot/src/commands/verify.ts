import {
   ChatInputCommandInteraction,
   GuildMember,
   SlashCommandBuilder,
   SlashCommandUserOption,
} from 'discord.js';

import { prismaInstance as prisma } from '@ch43-bot/prisma';

import { delay } from '../utils';
import { guildMemberAddHandler } from '../events/guild-member-add';

module.exports = {
   isAdmin: true,
   data: new SlashCommandBuilder()
      .setName('verify')
      .setDescription('Send a verification message to all unverified users.')
      .addUserOption((option: SlashCommandUserOption) =>
         option.setName('target').setDescription('The user to verify'),
      ),
   async execute(interaction: ChatInputCommandInteraction) {
      const { settings } = await prisma.guild.findUnique({
         where: {
            guildId: interaction.guild.id,
         },
         select: {
            settings: {
               select: {
                  verifiedRole: true,
               },
            },
         },
      });
      if (!settings || !settings.verifiedRole) {
         return await interaction.reply({
            ephemeral: true,
            content: 'No verified role has been set.',
         });
      }
      await interaction.deferReply();

      const target = interaction.options.get('target')?.value;

      const membersCollection = (
         await interaction.guild.members.fetch()
      )?.filter(
         (member) =>
            (!target || member.id === target) &&
            !member.roles.cache.has(settings.verifiedRole as string) &&
            !member.user.bot,
      );
      const members = membersCollection.values();

      let fails = 0;

      let member: GuildMember = members.next().value;
      while (member) {
         await delay(1000);
         try {
            await guildMemberAddHandler(member);
         } catch {
            fails++;
         }
         member = members.next().value;
      }
      await interaction.followUp({
         content: `A message has been sent to ${membersCollection.size} members (${fails} possible failures).`,
      });
   },
};
