import type { IronSessionOptions } from 'iron-session';

export const SESSION_COOKIE_NAME = 'session';

export const sessionOptions: IronSessionOptions = {
   password: process.env.SECRET_COOKIE_PASSWORD as string,
   cookieName: SESSION_COOKIE_NAME,
   cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
   },
};

declare module 'iron-session' {
   interface IronSessionData {
      user?: {
         name: string;
         email: string;
      };
      nonce?: string;
      state?: string;
      origin?: string;
   }
}
