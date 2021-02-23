import styles from "./callback.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TwitchParamsDto } from "dto/twitch-params.dto";
import { authWithTwitch } from "infrastructure/api";

export default function Test() {
  const router = useRouter();
  const [errored, setErrored] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(true);

  function parseHash() {
    try {
      if (!window.location.hash) {
        setShowTryAgain(false);
        throw new Error("There is no hash.");
      }
      const params = window.location.hash
        .replace("#", "")
        .split("&")
        .reduce((acc, item) => {
          const [key, value] = item.split("=");

          acc[key] = unescape(value);

          return acc;
        }, {} as TwitchParamsDto);

      if (!params.token_type || !params.access_token || !params.scope) {
        setShowTryAgain(false);
        throw new Error(
          `Without required twitch params: ${JSON.stringify(params)}.`
        );
      }

      authWithTwitch(params);
    } catch (error) {
      console.error(error);
      setErrored(true);

      if (!showTryAgain) {
        console.info("run router.push");
        setTimeout(() => router.push("/"), 3000);
      }
    }
  }

  useEffect(parseHash, []);

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
