import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

import { getCommandsArray } from './utils';

config();

const commands = getCommandsArray();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest
   .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands.map((v) => v.data.toJSON()),
   })
   .then(() => console.log('Successfully registered application commands.'))
   .catch(console.error);
