'use client';

import React from 'react';
import { useLogin } from '../utils/hooks';

const Unauthenticated = () => {
   const { login } = useLogin();

   return (
      <>
         <button className="login-button" onClick={login}>
            LOGIN
         </button>
      </>
   );
};

export default Unauthenticated;
