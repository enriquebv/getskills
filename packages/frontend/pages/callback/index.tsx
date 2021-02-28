import styles from "./callback.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TwitchParamsDto } from "dto/twitch-params.dto";
import { authWithTwitch } from "infrastructure/api";

class WithoutHashException {}

class BadTwitchParams {
  public params: any = {};

  constructor(params: any) {
    this.params = params;
  }
}

export default function Test() {
  const router = useRouter();
  const [errored, setErrored] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(true);

  async function parseHash() {
    try {
      if (!window.location.hash) {
        throw new WithoutHashException();
      }

      const params = window.location.hash
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

      if (!params.token_type || !params.access_token || !params.scopes) {
        throw new BadTwitchParams(params);
      }

      await authWithTwitch(params);
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

  // When pages mount
  useEffect(() => {
    parseHash();
  }, []);

  // useEffect(
  //   (): any =>
  //     !showTryAgain && errored && setTimeout(() => router.push("/"), 4000),
  //   [showTryAgain, errored]
  // );

  return (
    <div className={styles["callback-page"]}>
      {!errored ? (
        <h1>
          <FontAwesomeIcon icon={faCircleNotch} />
          Loading...
        </h1>
      ) : (
        <>
          <h1 className={styles["error"]}>
            Oops! Sorry, but an <span>error</span> has occurred.
          </h1>
          {showTryAgain ? (
            <button onClick={parseHash}>Try again</button>
          ) : (
            <p>Redirecting to main page...</p>
          )}
        </>
      )}
    </div>
  );
}
