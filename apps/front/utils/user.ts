import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from './session';

export const getServerSideProps = withIronSessionSsr(
   ({ req }) => ({
      props: {
         user: req.session.user || null,
      },
   }),
   sessionOptions,
);
