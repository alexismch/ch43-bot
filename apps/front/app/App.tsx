'use client';

import React from 'react';
import { useLogin } from '../utils/hooks';

const App = ({ user }) => {
   const { login, logout } = useLogin();

   return (
      <span className="App-title">
         {!user ? (
            <button className="App-button" onClick={login}>
               LOGIN
            </button>
         ) : (
            <>
               {user.name}
               <p>
                  <button className="App-button" onClick={logout}>
                     LOGOUT
                  </button>
               </p>
            </>
         )}
      </span>
   );
};

export default App;
