'use client';

import React from 'react';
import { useLogin } from '../../../utils/hooks';

const Unauthenticated = () => {
   const { login } = useLogin();

   return (
      <>
         <p>Click on the button below in order to complete the verification</p>
         <button className="App-button" onClick={login}>
            CONFIRM
         </button>
      </>
   );
};

export default Unauthenticated;
