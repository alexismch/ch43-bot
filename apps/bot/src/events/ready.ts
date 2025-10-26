import { Client, ActivityType } from 'discord.js';

export const readyHandler = (client: Client) => {
   console.log('Bot ready to fight!');
   client.user?.setPresence({
      afk: true,
      activities: [{ name: 'CS:GO', type: ActivityType.Playing }],
      status: 'online',
   });
};
