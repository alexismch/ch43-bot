import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/config/session';
import { CryptoProvider } from '@azure/msal-node';
import { clientApplication, getMsalConfig } from '../../../utils/config/msal';
import { AuthorizationCodeRequest } from '@azure/msal-node/dist/request/AuthorizationCodeRequest';
import { AuthorizationCodePayload } from '@azure/msal-common';

const requestConfig = getMsalConfig().request;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'GET') {
      return res.status(404).send(null);
   }

   if (!req.query.code) {
      return await loginHandler(req, res);
   }

   return await callBackHandler(req, res);
};

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.session.user) {
      return res.status(201).send(null);
   }

   const { authCodeUrlParameters } = requestConfig;

   const cryptoProvider = new CryptoProvider();

   if (req.query) {
      authCodeUrlParameters.state = req.query.state
         ? req.query.state
         : cryptoProvider.createNewGuid();

      authCodeUrlParameters.nonce = req.query.nonce
         ? req.query.nonce
         : cryptoProvider.createNewGuid();

      if (req.query.prompt) authCodeUrlParameters.prompt = req.query.prompt;

      if (req.query.loginHint)
         authCodeUrlParameters.loginHint = req.query.loginHint;

      if (req.query.domainHint)
         authCodeUrlParameters.domainHint = req.query.domainHint;
   }

   req.session.nonce = authCodeUrlParameters.nonce;
   req.session.state = authCodeUrlParameters.state;
   req.session.origin = req.query.origin as string;
   await req.session.save();

   try {
      const authCodeUrl = await clientApplication.getAuthCodeUrl(
         authCodeUrlParameters,
      );

      return res.redirect(302, authCodeUrl).send(null);
   } catch (e) {
      console.log(e);
      return res
         .redirect(302, `${req.session.origin || '/'}?error=LOGIN`)
         .send(null);
   }
};

const callBackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (!req.query.code) {
      return res.redirect(`${req.session.origin || '/'}`).send(null);
   }

   const tokenRequest: AuthorizationCodeRequest = {
      ...requestConfig.tokenRequest,
      code: req.query.code as string,
      state: req.query.state as string,
   };
   const authCodeResponse: AuthorizationCodePayload = {
      nonce: req.session.nonce,
      code: req.query.code as string,
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

      const origin = req.session.origin;

      delete req.session.origin;
      delete req.session.nonce;
      delete req.session.state;
      await req.session.save();

      return res.redirect(302, `${origin || '/'}`).send(null);
   } catch (e) {
      console.log(e);
      return res
         .redirect(302, `${req.session.origin || '/'}?error=LOGIN_CALLBACK`)
         .send(null);
   }
};

export default withIronSessionApiRoute(handler, sessionOptions);
