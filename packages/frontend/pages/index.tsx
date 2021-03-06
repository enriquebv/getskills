import Head from "next/head";
import GlobalLayout from "layouts/global.layout";
import styles from "./index.module.scss";
import Image from "next/image";
import { parseCookieHeader } from "strict-cookie-parser";

const NEXT_PUBLIC_TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const NEXT_PUBLIC_TWITCH_CALLBACK_URL =
  process.env.NEXT_PUBLIC_TWITCH_CALLBACK_URL;

const oauthTwithUrl = [
  `https://id.twitch.tv/oauth2/authorize?client_id=${NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
  `redirect_uri=${NEXT_PUBLIC_TWITCH_CALLBACK_URL}`,
  `response_type=token`,
  `scope=user:read:email channel:manage:redemptions`,
].join("&");

// Helper to get cookies Map
const getCookies = (ctx: any): Map<string, string> | null =>
  parseCookieHeader(ctx.req.headers.cookie || "");

// If users have token-access, redirect them to /app
export async function getServerSideProps(ctx: any) {
  const cookies = getCookies(ctx as any);

  if (cookies && cookies.get("gs.access") !== undefined) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Home() {
  return (
    <GlobalLayout>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles["page-index"]}>
        <div className={styles["text"]}>
          <h1>BRING SKILLS TO YOUR TWITCH CHANNEL</h1>
          <p>
            Using Twitch Channel Points, you can create new viewer experiences
            to your channel. Bids, Discord roles, leaderboars, etc.{" "}
          </p>
          <a className={styles["login"]} href={oauthTwithUrl}>
            Login with Twitch
          </a>
        </div>
        <div className={styles["images"]}>
          <Image
            src="/home-illustration.png"
            width={400}
            height={400}
            objectFit="contain"
          />
        </div>
      </div>
    </GlobalLayout>
  );
}
