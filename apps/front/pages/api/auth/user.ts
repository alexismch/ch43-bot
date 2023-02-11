import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/config/session';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'GET') {
      return res.status(404).send(null);
   }

   const user = req.session.user;
   if (!user) {
      return res.status(401).send(null);
   }

   return res.send(user);
};

export default withIronSessionApiRoute(handler, sessionOptions);
