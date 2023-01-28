import { EmbedBuilder } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

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

   const verification = await prisma.verification.findUnique({
      where: {
         id,
      },
   });
   if (!verification) {
      return res.status(404).send('No verification found');
   }

   const user = await prisma.user.findFirst({
      where: {
         OR: [
            {
               name: reqUser.name,
            },
            {
               email: reqUser.email,
            },
         ],
         AND: {
            guildId: verification.guildId,
         },
      },
      select: {
         id: true,
      },
   });
   if (user) {
      return res
         .status(409)
         .send({ message: 'Your user is already in use on this server' });
   }

   const settings = await prisma.settings.findFirst({
      where: {
         guildId: verification.guildId,
      },
      select: {
         verifiedRole: true,
         helpTicketsChannel: true,
      },
   });

   if (settings && settings.verifiedRole) {
      const rest = new REST({ version: '9' }).setToken(
         process.env.DISCORD_TOKEN,
      );
      await rest.put(
         Routes.guildMemberRole(
            verification.guildId,
            verification.userId,
            settings.verifiedRole,
         ),
      );

      await prisma.verification.delete({
         where: {
            id,
         },
      });

      await prisma.user.create({
         data: {
            guildId: verification.guildId,
            userId: verification.userId,
            name: reqUser.name,
            email: reqUser.email,
         },
      });

      if (settings.helpTicketsChannel) {
         await rest.post(Routes.channelMessages(settings.helpTicketsChannel), {
            body: {
               embeds: [
                  new EmbedBuilder()
                     .setColor('#3ba55c')
                     .setTitle('User verified!')
                     .setDescription(
                        `<@${verification.userId}> has been verified!`,
                     )
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
