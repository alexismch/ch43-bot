'use client';

import React from 'react';
import { InternalError, NotFound, Unauthorized } from '../utils/errors';

type BaseError = {
   code: number;
   title: string;
};

const Error = ({ error: thrownError }: { error: Error }) => {
   console.log(thrownError);
   let error: BaseError;
   switch (thrownError.message) {
      case Unauthorized.title:
         error = Unauthorized;
         break;
      case NotFound.title:
         error = NotFound;
         break;
      default:
         error = InternalError;
   }

   return (
      <p>
         <span className="text-7xl text-light-primary dark:text-dark-primary">
            {error.code}
         </span>
         <br />
         {error.title}
      </p>
   );
};

export default Error;
