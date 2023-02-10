import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/config/session';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'GET') {
      return res.status(404).send(null);
   }

   const origin = (req.query?.origin as string) || req.session.origin;
   req.session.destroy();

   return res.redirect(origin || '/').send(null);
};

export default withIronSessionApiRoute(handler, sessionOptions);
