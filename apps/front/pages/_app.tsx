import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
   return (
      <>
         <Head>
            <title>Ch43 Bot</title>
            <link rel="shortcut icon" href="/vinci-logo.png" />
         </Head>
         <div className="App">
            <Component {...pageProps} />
         </div>
      </>
   );
};

export default MyApp;
