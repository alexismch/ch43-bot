'use client';

import { NotFound as NotFoundError } from '../utils/errors';
import { useEffect } from 'react';

const NotFound = () => {
   useEffect(() => {
      throw new NotFoundError();
   }, []);
};

export default NotFound;
