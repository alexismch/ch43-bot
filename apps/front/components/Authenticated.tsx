'use client';

import React from 'react';
import { useLogin } from '../utils/hooks';

const Authenticated = ({ user }: { user: { name?: string } }) => {
   const { logout } = useLogin();

   return (
      <>
         {user.name}
         <p>
            <button className="App-button" onClick={logout}>
               LOGOUT
            </button>
         </p>
      </>
   );
};

export default Authenticated;
