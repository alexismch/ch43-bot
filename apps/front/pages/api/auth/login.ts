import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import { getMsalConfig, clientApplication } from '../../../utils/msal';
import { CryptoProvider } from '@azure/msal-node';
import { AuthorizationCodeRequest } from '@azure/msal-node/dist/request/AuthorizationCodeRequest';
import { AuthorizationCodePayload } from '@azure/msal-common';

const requestConfig = getMsalConfig().request;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'GET') {
      return res.status(404).send(null);
   }

   if (req.session.user) {
      return res.redirect(req.session.origin || '/');
   }

   if (req.query.code) {
      return await callBackHandler(req, res);
   }

   return await loginHandler(req, res);
};

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

      return res.redirect(authCodeUrl);
   } catch (e) {
      return res.status(500).json(e);
   }
};

const callBackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
      await req.session.save();

      return res.redirect(req.session.origin || '/');
   } catch (e) {
      return res.status(500).send(e);
   }
};

export default withIronSessionApiRoute(handler, sessionOptions);
