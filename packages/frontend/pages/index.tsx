import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import indexCss from './index.module.css'
import { registerUser } from 'infrastructure/api'
import { Route } from 'next/dist/next-server/server/router';

const oauthTwithUrl = [
  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
  `redirect_uri=http://localhost:8080`,
  `response_type=token`,
  `scope=user:read:email`
].join('&');

interface RouteConfig {
  access_token?: string
  token_type?: string
}

const routeToConfig = (route: string): RouteConfig => {
  if (route.indexOf('/#') === -1) {
    return {}
  }

  return route.replace('/#', '').split('&').reduce((acc, string) => {
    const [key, value] = string.split('=');

    if (['access_token', 'token_type'].includes(key)) {
      acc[key] = value;
    }

    return acc;
  }, {});
}

export default function Home({ }) {
  const router = useRouter();

  async function registerUserInBackend(config: RouteConfig) {
    try {
      await registerUser({
        token: config.access_token,
        type: config.token_type
      });
    } catch (error) {
      alert('NO ha funcionado, vuelve a logearte')
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
    <div className="container">
      <Head>
        <title>GetSkills.live</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={indexCss.main}>
        <h1>
          GetSkills.live
        </h1>
        <a href={oauthTwithUrl}>Login</a>
      </main>

      <footer></footer>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
