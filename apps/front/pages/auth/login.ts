import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';

const Login = () => null;

export const getServerSideProps = withIronSessionSsr(({ req, query }) => {
   if (req.session.user) {
      return {
         redirect: {
            destination: (query.origin as string) || '/',
            permanent: false,
         },
      };
   }

   return {
      redirect: {
         destination: '/api/auth/login',
         permanent: false,
      },
   };
}, sessionOptions);

export default Login;
