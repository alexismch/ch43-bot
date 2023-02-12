import React from 'react';

export const metadata = {
   title: {
      default: 'Guilds',
      template: '%s | Guilds',
   },
};

export default function RootLayout({ children }) {
   return <>{children}</>;
}
