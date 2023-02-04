import {
   ActionRowBuilder,
   ButtonBuilder,
   ButtonComponent,
   ButtonInteraction,
   ButtonStyle,
   ComponentType,
   DMChannel,
   EmbedBuilder,
   GuildMember,
   TextChannel,
} from 'discord.js';
import { prismaInstance as prisma } from '@ch43-bot/prisma';

export const guildMemberAddHandler = async (guildMember: GuildMember) => {
   try {
      const verification =
         (await prisma.verification.findFirst({
            where: {
               guildId: guildMember.guild?.id as string,
               userId: guildMember.user.id,
            },
         })) ||
         (await prisma.verification.create({
            data: {
               guildId: guildMember.guild?.id as string,
               userId: guildMember.user.id,
            },
         }));

      const settings = await prisma.settings.findFirst({
         where: {
            guildId: guildMember.guild.id,
         },
      });

      const embed = new EmbedBuilder()
         .setColor('#3ba55c')
         .setTitle('Welcome!')
         .setURL(`${process.env.FRONT_URL}/confirm/${verification.id}`)
         .setDescription(
            `You just joined **[${guildMember.guild?.name}](https://discord.com/channels/${guildMember.guild?.id})** server, welcome!`,
         )
         .addFields(
            {
               name: 'Verify your account',
               value: 'Please follow the link below in order to verify your account.',
            },
            {
               name: 'Need help?!',
               value: 'If you need any help, click on the **Help!** button or contact an admin.',
            },
         );

      const components = [
         new ButtonBuilder()
            .setLabel('Verify')
            .setStyle(ButtonStyle.Link)
            .setURL(`${process.env.FRONT_URL}/confirm/${verification.id}`),
      ];

      if (settings && settings.helpTicketsChannel) {
         components.push(
            new ButtonBuilder()
               .setCustomId('help_button')
               .setLabel('Help!')
               .setStyle(ButtonStyle.Danger),
         );
      }

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
         components,
      );

      const dmChannel: DMChannel = await guildMember.createDM();
      const dmMessage = await dmChannel.send({
         embeds: [embed],
         components: [row],
      });

      if (settings && settings.helpTicketsChannel) {
         const collector = dmMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
         });

         collector.on('collect', async (interaction: ButtonInteraction) => {
            const helpTicketsChannel = guildMember.guild.channels.resolve(
               settings.helpTicketsChannel as string,
            );
            const updatedButton = new ButtonBuilder(
               (interaction.component as ButtonComponent).data,
            ).setDisabled(true);

            try {
               if (!helpTicketsChannel || !helpTicketsChannel.isTextBased) {
                  throw new Error();
               }

               await (helpTicketsChannel as TextChannel).send({
                  embeds: [
                     new EmbedBuilder()
                        .setColor('#ed4245')
                        .setTitle('Help requested!')
                        .setDescription(
                           `<@${guildMember.user.id}> requested help for verification!`,
                        ),
                  ],
               });

               updatedButton.setStyle(ButtonStyle.Success);
               updatedButton.setLabel('Help has been requested.');
            } catch {
               await dmChannel.send(
                  'An error occurred, please contact an admin by yourself.',
               );
            }

            await interaction.update({
               components: interaction.message.components.map((r) =>
                  new ActionRowBuilder<ButtonBuilder>(r).setComponents(
                     r.components.map((b: ButtonComponent) =>
                        b.customId === interaction.customId
                           ? updatedButton
                           : new ButtonBuilder(b.data),
                     ),
                  ),
               ),
            });

            collector.stop();
         });
      }
   } catch (e) {
      console.log('---');
      console.log(
         `guildMemberAddHandler error ${guildMember.id} ${guildMember.nickname}`,
      );
      console.log(e);
      console.log('---');
   }
};
