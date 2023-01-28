import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';
import { clientApplication, getMsalConfig } from '../../utils/msal';
import { CryptoProvider } from '@azure/msal-node';
import { ParsedUrlQuery } from 'querystring';
import { AuthorizationCodeRequest } from '@azure/msal-node/dist/request/AuthorizationCodeRequest';
import { AuthorizationCodePayload } from '@azure/msal-common';

const Login = () => null;

const requestConfig = getMsalConfig().request;

export const getServerSideProps = withIronSessionSsr(async ({ req, query }) => {
   if (req.session.user) {
      return {
         redirect: {
            destination: (query.origin as string) || req.session.origin || '/',
            permanent: false,
         },
      };
   }

   if (query.code) {
      return await callBackHandler(req, query);
   }

   return await loginHandler(req, query);
}, sessionOptions);

const loginHandler = async (req, query: ParsedUrlQuery) => {
   const { authCodeUrlParameters } = requestConfig;

   const cryptoProvider = new CryptoProvider();

   if (query) {
      authCodeUrlParameters.state = query.state
         ? query.state
         : cryptoProvider.createNewGuid();

      authCodeUrlParameters.nonce = query.nonce
         ? query.nonce
         : cryptoProvider.createNewGuid();

      if (query.prompt) authCodeUrlParameters.prompt = query.prompt;

      if (query.loginHint) authCodeUrlParameters.loginHint = query.loginHint;

      if (query.domainHint) authCodeUrlParameters.domainHint = query.domainHint;
   }

   req.session.nonce = authCodeUrlParameters.nonce;
   req.session.state = authCodeUrlParameters.state;
   req.session.origin = query.origin as string;
   await req.session.save();

   try {
      const authCodeUrl = await clientApplication.getAuthCodeUrl(
         authCodeUrlParameters,
      );

      return {
         redirect: {
            destination: authCodeUrl,
            permanent: false,
         },
      };
   } catch (e) {
      console.log(e);
      return {
         redirect: {
            destination: (query.origin as string) || req.session.origin || '/',
         },
         props: {
            error: 'LOGIN',
         },
      };
   }
};

const callBackHandler = async (req, query: ParsedUrlQuery) => {
   const tokenRequest: AuthorizationCodeRequest = {
      ...requestConfig.tokenRequest,
      code: query.code as string,
      state: query.state as string,
   };
   const authCodeResponse: AuthorizationCodePayload = {
      nonce: req.session.nonce,
      code: query.code as string,
      state: req.session.state,
   };

   try {
      const response = await clientApplication.acquireTokenByCode(
         tokenRequest,
         authCodeResponse,
      );

      req.session.user = {
         name: response.account.name,
         email: response.account.username,
      };
      await req.session.save();

      return {
         redirect: {
            destination: (query.origin as string) || req.session.origin || '/',
            permanent: false,
         },
      };
   } catch (e) {
      console.log(e);
      return {
         redirect: {
            destination: (query.origin as string) || req.session.origin || '/',
         },
         props: {
            error: 'LOGIN_CALLBACK',
         },
      };
   }
};

export default Login;
