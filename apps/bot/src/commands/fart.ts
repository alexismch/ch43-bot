import {
   ChatInputCommandInteraction,
   Message,
   SlashCommandBuilder,
   SlashCommandUserOption,
} from 'discord.js';

module.exports = {
   data: new SlashCommandBuilder()
      .setName('fart')
      .setDescription('Replies with PROUUUT...')
      .addUserOption((option: SlashCommandUserOption) =>
         option.setName('target').setDescription('The user to fart on'),
      ),
   async execute(interaction: ChatInputCommandInteraction) {
      let replyTo: ChatInputCommandInteraction | Message = interaction;
      const target = interaction.options.get('target');
      if (target) {
         replyTo = (await interaction.reply({
            content: `<@${interaction.user.id}> farted on <@${target.value}>.`,
            fetchReply: true,
         })) as Message;
      }
      return replyTo.reply('PROUUUT...');
   },
};
