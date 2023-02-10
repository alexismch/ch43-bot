import { LogLevel, ConfidentialClientApplication } from '@azure/msal-node';

const redirectUri = `${process.env.FRONT_URL}/api/auth/login`;
const scopes = ['email', 'profile', 'User.Read'];

const getMsalConfig = () => {
   return {
      authOptions: {
         clientId: process.env.AZURE_CLIENT_ID,
         authority: process.env.AZURE_AUTHORITY,
         clientSecret: process.env.AZURE_CLIENT_SECRET,
      },
      request: {
         authCodeUrlParameters: {
            redirectUri,
            scopes,
            state: undefined,
            nonce: undefined,
            prompt: undefined,
            loginHint: undefined,
            domainHint: undefined,
         },
         tokenRequest: {
            redirectUri,
            scopes,
         },
      },
      resourceApi: {
         endpoint: 'https://graph.microsoft.com/v1.0/me',
      },
   };
};

const loggerOptions = {
   loggerCallback(loglevel, message) {
      console.log(message);
   },
   piiLoggingEnabled: false,
   logLevel: LogLevel.Verbose,
};

const clientConfig = {
   auth: getMsalConfig().authOptions,
   system: {
      loggerOptions:
         process.env.NODE_ENV !== 'production' ? loggerOptions : undefined,
   },
};

const clientApplication = new ConfidentialClientApplication(clientConfig);

export { getMsalConfig, clientApplication };
