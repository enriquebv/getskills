import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { registerUser } from "infrastructure/api";
import { Route } from "next/dist/next-server/server/router";
import GlobalLayout from "layouts/global.layout";

const oauthTwithUrl = [
  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
  `redirect_uri=http://localhost:8080`,
  `response_type=token`,
  `scope=user:read:email`,
].join("&");

interface RouteConfig {
  access_token?: string;
  token_type?: string;
}

const routeToConfig = (route: string): RouteConfig => {
  if (route.indexOf("/#") === -1) {
    return {};
  }

  return route
    .replace("/#", "")
    .split("&")
    .reduce((acc, string) => {
      const [key, value] = string.split("=");

      if (["access_token", "token_type"].includes(key)) {
        acc[key] = value;
      }

      return acc;
    }, {});
};

export default function Home({}) {
  const router = useRouter();

  async function registerUserInBackend(config: RouteConfig) {
    try {
      await registerUser({
        token: config.access_token,
        type: config.token_type,
      });
    } catch (error) {
      alert("NO ha funcionado, vuelve a logearte");
    }
  }

  useEffect(() => {
    const { asPath } = router;
    const config = routeToConfig(asPath);

    if (config.access_token !== undefined) {
      registerUserInBackend(config);
    }
  }, []);

  return (
    <GlobalLayout>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a href={oauthTwithUrl}>Login</a>
    </GlobalLayout>
  );
}
