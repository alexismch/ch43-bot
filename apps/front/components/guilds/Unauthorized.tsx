'use client';

import { useEffect } from 'react';
import { Unauthorized as UnauthorizedError } from '../../utils/errors';

const Unauthorized = () => {
   useEffect(() => {
      throw new UnauthorizedError();
   }, []);

   return <></>;
};

export default Unauthorized;
