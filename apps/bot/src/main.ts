import { config } from 'dotenv';
import { Client, Events } from 'discord.js';

import { prismaInstance as prisma } from '@ch43-bot/prisma';

import {
   guildCreateHandler,
   guildDeleteHandler,
   guildMemberAddHandler,
   guildMemberRemoveHandler,
   interactionCreateHandler,
   messageCreateHandler,
   readyHandler,
} from './events';
import { clientIntents, clientPartials } from './utils';

config();

export const client: Client = new Client({
   intents: clientIntents,
   partials: clientPartials,
});

client.once(Events.ClientReady, readyHandler);

client.on(Events.GuildCreate, guildCreateHandler);

client.on(Events.GuildDelete, guildDeleteHandler);

client.on(Events.InteractionCreate, interactionCreateHandler);

client.on(Events.GuildMemberAdd, guildMemberAddHandler);

client.on(Events.GuildMemberRemove, guildMemberRemoveHandler);

client.on(Events.MessageCreate, messageCreateHandler);

prisma
   .$connect()
   .then(() => {
      client.login(process.env.DISCORD_TOKEN).catch(console.error);
   })
   .catch(console.error);
