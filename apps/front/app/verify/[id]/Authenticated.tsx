'use client';

import React, { useEffect, useState } from 'react';

const Authenticated = ({
   userId,
   user,
}: {
   userId: string;
   user: { name?: string | null };
}) => {
   const [message, setMessage] = useState<string>(
      'Verification in progress...',
   );

   useEffect(() => {
      fetch(`/api/users/${userId}/verify`, {
         method: 'PATCH',
      })
         .then((r) => {
            if (r.status !== 204) {
               return r.json();
            }
            setMessage('Thanks for having completed the verification');
         })
         .then((body: { message: string } | undefined) => {
            if (!body) {
               return;
            }
            if (!body.message) {
               throw new Error();
            }
            setMessage(body.message);
         })
         .catch((e) => {
            console.log(e);
            setMessage('An error occurred during the verification');
         });
   }, [userId]);

   return (
      <>
         <p>{message}</p>
         <span className="App-title">{user.name}</span>
      </>
   );
};

export default Authenticated;
