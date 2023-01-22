import {
   BitFieldResolvable,
   GatewayIntentBits,
   GatewayIntentsString,
   Partials,
} from 'discord.js';

export const clientIntents: BitFieldResolvable<GatewayIntentsString, number> = [
   GatewayIntentBits.Guilds,
   GatewayIntentBits.GuildMembers,
   GatewayIntentBits.GuildBans,
   GatewayIntentBits.GuildEmojisAndStickers,
   GatewayIntentBits.GuildIntegrations,
   GatewayIntentBits.GuildWebhooks,
   GatewayIntentBits.GuildInvites,
   GatewayIntentBits.GuildVoiceStates,
   GatewayIntentBits.GuildPresences,
   GatewayIntentBits.GuildMessages,
   GatewayIntentBits.GuildMessageReactions,
   GatewayIntentBits.GuildMessageTyping,
   GatewayIntentBits.DirectMessages,
   GatewayIntentBits.DirectMessageReactions,
   GatewayIntentBits.DirectMessageTyping,
];
export const clientPartials: Partials[] = [
   Partials.Channel,
   Partials.GuildMember,
   Partials.Message,
   Partials.Reaction,
   Partials.User,
];
