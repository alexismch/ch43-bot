import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';

const Logout = () => null;

export const getServerSideProps = withIronSessionSsr(async ({ req, query }) => {
   if (!req.session.user) {
      return {
         redirect: {
            destination: (query.origin as string) || '/',
            permanent: false,
         },
      };
   }

   return {
      redirect: {
         destination: '/api/auth/logout',
         permanent: false,
      },
   };
}, sessionOptions);

export default Logout;
