'use client';

import React from 'react';
import { InternalError, NotFound, Unauthorized } from '../utils/errors';
import Link from 'next/link';

type BaseError = {
   code: number;
   title: string;

   description: string;
};

const Error = ({ error: thrownError }: { error: Error }) => {
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
      <div className="grid place-items-center py-24 px-6 sm:py-32 lg:px-8">
         <div className="text-center">
            <p className="text-base font-semibold text-light-primary dark:text-dark-primary">
               {error.code}
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-light-dark-grey dark:text-dark-white sm:text-5xl">
               {error.title}
            </h1>
            <p className="mt-6 text-base leading-7 text-light-light-grey dark:text-white">
               {error.description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
               <Link
                  href="/"
                  className="rounded-md bg-none px-3.5 py-2.5 text-sm font-semibold text-light-primary dark:text-dark-primary shadow-sm border-2 border-light-primary dark:border-dark-primary hover:bg-light-primary dark:hover:bg-dark-primary hover:text-light-white dark:hover:text-dark-black">
                  Go back home
               </Link>
               <Link
                  href="mailto:contact@alexismch.com"
                  className="text-sm font-semibold text-light-dark-grey dark:text-dark-white hover:underline">
                  Contact support <span aria-hidden="true">&rarr;</span>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default Error;
