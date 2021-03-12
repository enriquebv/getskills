import { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";
import Head from "next/head";

// Styles
import "tippy.js/dist/tippy.css";
import "modern-normalize";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import "styles/global.scss";

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
