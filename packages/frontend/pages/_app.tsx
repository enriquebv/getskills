import { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";

// Styles
import "tippy.js/dist/tippy.css";
import "modern-normalize";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "megadraft/dist/css/megadraft.css";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/beagle.css";
import "react-slidedown/lib/slidedown.css";

import { ThemeProvider } from "@material-ui/styles";
import { theme } from "lib/theme";
import "styles/global.scss";

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GetSkills.live</title>
      </Head>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(App);
