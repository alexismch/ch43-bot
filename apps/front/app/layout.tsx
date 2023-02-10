import React from 'react';
import '../styles/globals.css';

export const metadata = {
   title: {
      default: 'Ch43 Bot',
      template: '%s | Ch43 Bot',
   },
   icons: {
      icon: '/vinci-logo.png',
   },
};

export default function RootLayout({ children }) {
   return (
      <html>
         <body>
            <div className="App">{children}</div>
         </body>
      </html>
   );
}
