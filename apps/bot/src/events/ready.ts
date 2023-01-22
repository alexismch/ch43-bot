import { client } from '../main';
import { ActivityType } from 'discord-api-types/v10';

export const readyHandler = () => {
   console.log('Bot ready to fight!');
   client.user?.setPresence({
      afk: true,
      activities: [{ name: 'CS:GO', type: ActivityType.Playing }],
      status: 'online',
   });
};
