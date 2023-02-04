import { EmbedBuilder, REST, Routes } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../../utils/session';
import { prismaInstance as prisma } from '@ch43-bot/prisma';

type Request = NextApiRequest & {
   query: {
      id: string;
   };
};

const handler = async (req: Request, res: NextApiResponse) => {
   if (req.method !== 'PATCH') {
      return res.status(404).send(null);
   }

   const reqUser = req.session.user;

   if (!reqUser) {
      return res.status(401);
   }

   const {
      query: { id },
   } = req;

   const {
      guild: { settings, ...guild },
      ...user
   } = await prisma.user.findUnique({
      where: {
         id,
      },
      select: {
         id: true,
         userId: true,
         isVerified: true,
         guild: {
            select: {
               guildId: true,
               settings: {
                  select: {
                     verifiedRole: true,
                     helpTicketsChannel: true,
                  },
               },
            },
         },
      },
   });
   if (!user) {
      return res.status(404).send('No user found');
   } else if (user.isVerified) {
      return res.status(403).send('User already verified');
   }

   const usersCounter = await prisma.user.count({
      where: {
         guildId: guild.guildId,
         email: reqUser.email,
      },
   });
   if (usersCounter) {
      return res.status(409).send({
         message: 'Your email address is already in use on this server',
      });
   }

   if (settings && settings.verifiedRole) {
      const rest = new REST({ version: '10' }).setToken(
         process.env.DISCORD_TOKEN,
      );
      await rest.put(
         Routes.guildMemberRole(
            guild.guildId,
            user.userId,
            settings.verifiedRole,
         ),
      );

      await prisma.user.update({
         where: {
            id: user.id,
         },
         data: {
            name: reqUser.name,
            email: reqUser.email,
            isVerified: true,
         },
      });

      if (settings.helpTicketsChannel) {
         await rest.post(Routes.channelMessages(settings.helpTicketsChannel), {
            body: {
               embeds: [
                  new EmbedBuilder()
                     .setColor('#3ba55c')
                     .setTitle('User verified!')
                     .setDescription(`<@${user.userId}> has been verified!`)
                     .addFields(
                        {
                           name: 'Name',
                           value: reqUser.name,
                        },
                        {
                           name: 'E-mail',
                           value: reqUser.email,
                        },
                     ),
               ],
            },
         });
      }
   } else {
      res.status(449).send({
         message:
            'No verified role specified yet for this server, please contact an admin',
      });
   }

   return res.status(204).send(null);
};

export default withIronSessionApiRoute(handler, sessionOptions);
