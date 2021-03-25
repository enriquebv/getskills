import Link from "next/link";
import { serverSideTranslationsProps } from "lib/server-side-translation";

export const getStaticProps = serverSideTranslationsProps(["common", "footer"]);

import AppLayout from "layouts/app.layout";
export default function BaseApp() {
  return (
    <AppLayout title="Dashboard">
      <h2>Hi!</h2>

      <p>
        If you are here, you are viewing an alpha version of the application,
        which is participating in the{" "}
        <a target="_blank" href="https://twitchchannelpoints.devpost.com/">
          Twitch Channel Points Hackaton
        </a>
        .
      </p>

      <p>
        If you have any questions, or above all, suggestions, feel free to
        contact me through <Link href="contact">this page.</Link>
      </p>

      <p>
        If you want to know about future plans, you can check our{" "}
        <Link href="roadmap">roadmap</Link>.
      </p>
    </AppLayout>
  );
}
