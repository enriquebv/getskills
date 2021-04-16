import { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";

// Styles
import "tippy.js/dist/tippy.css";
import "modern-normalize";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "react-slidedown/lib/slidedown.css";

import { ThemeProvider } from "@material-ui/styles";
import { theme } from "lib/theme";
import "styles/global.scss";
import { I18nConsistencyProvider } from "lib/i18n";

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GetSkills.live</title>
      </Head>
      <I18nConsistencyProvider>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </ThemeProvider>
      </I18nConsistencyProvider>
    </>
  );
}

export default appWithTranslation(App);
