import Head from "next/head";
import GlobalLayout from "layouts/global.layout";
import styles from "./index.module.scss";
import Image from "next/image";

const oauthTwithUrl = [
  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
  `redirect_uri=http://localhost:8080`,
  `response_type=token`,
  `scope=user:read:email`,
].join("&");

export default function Home({}) {
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
            src="/index.png"
            width={400}
            height={400}
            objectFit="contain"
          />
        </div>
      </div>
    </GlobalLayout>
  );
}
