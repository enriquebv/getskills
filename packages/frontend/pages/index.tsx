import Head from "next/head";
import GlobalLayout from "layouts/global.layout";
import styles from "./index.module.scss";
import Image from "next/image";
import useUser from "lib/use-user";
import Link from "next/link";
import oauthTwithUrl from "lib/twitch-oauth-url";

export default function Home() {
  const { user } = useUser();

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
          {user ? (
            <Link href="/app">
              <a className={styles["login"]}>Go to App</a>
            </Link>
          ) : (
            <a className={styles["login"]} href={oauthTwithUrl}>
              Login with Twitch
            </a>
          )}
        </div>
        <div className={styles["images"]}>
          <Image
            src="/home-illustration.png"
            alt="GetSkills.live"
            width={400}
            height={400}
            objectFit="contain"
          />
        </div>
      </div>
    </GlobalLayout>
  );
}
