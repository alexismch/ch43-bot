import { Guild, EmbedBuilder } from 'discord.js';
import { commands } from '../events';
import { Command } from '../utils';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

export const adminCommands = commands.reduce(
   (
      array: RESTPostAPIChatInputApplicationCommandsJSONBody[],
      command: Command,
   ) => {
      if (command.isAdmin) {
         array.push(command.data.toJSON());
      }
      return array;
   },
   [],
);

export const guildCreateHandler = async (guild: Guild) => {
   try {
      await guild.commands.set(adminCommands);
      const owner = await guild.members.resolve(guild.ownerId);
      const dmChannel = await owner?.createDM();
      dmChannel?.send({
         embeds: [
            new EmbedBuilder()
               .setColor('#3ba55c')
               .setTitle('Thanks for adding me!')
               .setDescription(
                  `Don't forget to setup the server via the management panel.`,
               ),
         ],
      });
   } catch (e) {
      console.log('---');
      console.log(`guildCreateHandler error ${guild.id} ${guild.name}`);
      console.log(e);
      console.log('---');
   }
};
