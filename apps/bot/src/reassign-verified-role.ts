import { config } from 'dotenv';
import { Client } from 'discord.js';
import { clientIntents, clientPartials, delay } from './utils';
import { prismaInstance as prisma } from '@ch43-bot/prisma';

config();

async function main() {
   const client: Client = new Client({
      intents: clientIntents,
      partials: clientPartials,
   });

   await prisma.$connect();
   await client.login(process.env.DISCORD_TOKEN);

   const users = await prisma.user.findMany({
      where: {
         isVerified: true,
      },
      include: {
         guild: true,
      },
   });

   for (let i = 0; i < users.length; i++) {
      const user = users[i];
      try {
         if (user.email.includes('@vinci.be')) {
            throw new Error();
         }

         const discordGuild = await client.guilds.fetch(user.guild.guildId);
         const discordUser = await discordGuild.members.fetch(user.userId);
         await discordUser.roles.add(user.guild.settings.verifiedRole);

         console.log(
            `${i + 1}/${users.length}`,
            discordUser.nickname || discordUser.user.username || user.name,
            '✅',
         );
      } catch {
         console.log(`${i + 1}/${users.length}`, user.name, '❌');
      } finally {
         await delay(1000);
      }
   }

   client.destroy();
   await prisma.$disconnect();
}

main();
