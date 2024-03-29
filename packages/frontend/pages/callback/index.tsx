import styles from "./callback.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { TwitchParamsDto } from "dto/twitch-params.dto";
import { authWithTwitch } from "infrastructure/api";
import { useRouter } from "next/dist/client/router";
import { serverSideTranslationsProps } from "lib/server-side-translation";
import { useTranslation } from "react-i18next";

class WithoutHashException {}

export const getStaticProps = serverSideTranslationsProps(["common", "footer"]);

class BadTwitchParams {
  public params: any = {};

  constructor(params: any) {
    this.params = params;
  }
}

function parseTwitchHash(hash: string): TwitchParamsDto {
  if (!hash) {
    throw new WithoutHashException();
  }

  const parsed = hash
    .replace("#", "")
    .split("&")
    .reduce((acc, item) => {
      const [key, value] = item.split("=");

      if (key === "scope") {
        acc.scopes = unescape(value).split("+");
      } else {
        acc[key] = unescape(value);
      }

      return acc;
    }, {} as TwitchParamsDto);

  if (!parsed.token_type || !parsed.access_token || !parsed.scopes) {
    throw new BadTwitchParams(parsed);
  }

  return parsed;
}

export default function Callback() {
  const router = useRouter();
  const [errored, setErrored] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(true);
  const { t } = useTranslation("common");

  async function auth() {
    try {
      const params = parseTwitchHash(window.location.hash);
      await authWithTwitch({ ...params, browser: true });
      switch (router.locale) {
        case "en":
          router.push("/app");
          break;
        default:
          router.push(`/${router.locale}/app`);
          break;
      }
    } catch (error) {
      setErrored(true);

      if (error instanceof WithoutHashException) {
        setShowTryAgain(false);
        return;
      }

      if (error instanceof BadTwitchParams) {
        console.warn(`Bad Twitch params ${JSON.stringify(error.params)}`);
        setShowTryAgain(false);
        return;
      }

      console.error(error);
    }
  }

  // When pages mount, try to auth
  useEffect(() => {
    auth();
  }, []);

  // If error needs re-auth, send the user again to index page
  useEffect(
    (): any =>
      !showTryAgain && errored && setTimeout(() => router.push("/"), 4000),
    [showTryAgain, errored]
  );

  return (
    <div className={styles["callback-page"]}>
      {!errored ? (
        <h1>
          <FontAwesomeIcon icon={faCircleNotch} />
          {t("loading")}...
        </h1>
      ) : (
        <>
          <h1 className={styles["error"]}>
            Oops! Sorry, but an <span>error</span> has occurred.
          </h1>
          {showTryAgain ? (
            <button onClick={auth}>Try again</button>
          ) : (
            <p>Redirecting to main page...</p>
          )}
        </>
      )}
    </div>
  );
}
