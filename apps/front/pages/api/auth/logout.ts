import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'GET') {
      return res.status(404).send(null);
   }

   req.session.destroy();

   return res.redirect(req.session.origin || '/');
};

export default withIronSessionApiRoute(handler, sessionOptions);
