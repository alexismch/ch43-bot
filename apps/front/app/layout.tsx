import React from 'react';

import '../styles/globals.css';

export const metadata = {
   title: {
      default: 'Ch43 Bot',
      template: '%s | Ch43 Bot',
   },
   description: 'The Ch43 bot to ensure students validity & uniqueness.',
   icons: {
      icon: '/vinci-logo.png',
   },
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body>
            <div className="text-center min-h-screen flex items-center justify-center flex-col text-light-black dark:text-dark-white text-[calc(10px+2vmin)]">
               {children}
            </div>
         </body>
      </html>
   );
}
