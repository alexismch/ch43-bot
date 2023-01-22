import { config } from 'dotenv';
config();

import { getCommandsArray } from './utils';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = getCommandsArray({ isAdmin: false });

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest
   .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands.map((v) => v.data.toJSON()),
   })
   .then(() => console.log('Successfully registered application commands.'))
   .catch(console.error);
