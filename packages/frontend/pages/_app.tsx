import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";

import "modern-normalize";

import "../styles/global.scss";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GetSkills.live</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
