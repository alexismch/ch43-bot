import { config } from 'dotenv';
config();

import { getCommandsArray } from './utils';
import { REST, Routes } from 'discord.js';

const commands = getCommandsArray({ isAdmin: false });

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest
   .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands.map((v) => v.data.toJSON()),
   })
   .then(() => console.log('Successfully registered application commands.'))
   .catch(console.error);
