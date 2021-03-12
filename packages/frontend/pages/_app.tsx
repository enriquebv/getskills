import { AppProps } from "next/app";
import Head from "next/head";
import "tippy.js/dist/tippy.css";

import "modern-normalize";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import "../styles/global.scss";
import { ToastProvider } from "react-toast-notifications";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GetSkills.live</title>
      </Head>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </>
  );
}
