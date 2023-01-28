import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';

const Logout = () => null;

export const getServerSideProps = withIronSessionSsr(({ req }) => {
   req.session.destroy();

   return {
      redirect: {
         destination: req.session.origin || '/',
         permanent: false,
      },
   };
}, sessionOptions);

export default Logout;
