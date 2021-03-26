import styles from "./styles.module.scss";
import { getGiveawayByUser } from "infrastructure/api";
import { GetServerSideProps } from "next";
import SSRError from "lib/ssr-error";
import { mapTranslationProps } from "lib/server-side-translation";
import useUser from "lib/use-user";
import { useTranslation } from "react-i18next";
import { InlineIcon } from "@iconify/react";

import { pickWinnerGiveaway } from "infrastructure/api";

// Icons
import facebookIcon from "@iconify/icons-brandico/facebook";
import twitterIcon from "@iconify/icons-brandico/twitter-bird";
import copyIcon from "@iconify/icons-mdi-light/content-duplicate";
import telegramIcon from "@iconify/icons-bx/bxl-telegram";
import twitchIcon from "@iconify/icons-bx/bxl-twitch";
import { useState } from "react";

// Components
import Modal from "components/modal";
import ReactConfetti from "react-confetti";
import ChannelPointsReward from "components/channel-points-reward";
import { resolve } from "path";
import { request } from "https";

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const { streamer } = query;
  const i18nProps = await mapTranslationProps(locale, [
    "common",
    "footer",
    "giveaway",
  ]);
  try {
    const response = await getGiveawayByUser(streamer as string);
    return { props: { giveaway: response.data, ...i18nProps } };
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;

      return {
        props: {
          ssrError: new SSRError(status, data?.message).toJSON(),
          ...i18nProps,
        },
      };
    }

    throw error;
  }
};

export default function GiveawayPage({
  giveaway,
  ssrError,
}: {
  giveaway: any;
  ssrError: SSRError;
}) {
  const { user } = useUser();
  const { t } = useTranslation("giveaway");
  const viewerIsAuthor = user?.id === giveaway.author?.id;
  const [fullDescription, setFullDescription] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  if (ssrError) {
    return JSON.stringify(ssrError);
  }

  async function pickWinner() {
    // await pickWinnerGiveaway(giveaway.id);
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
    setWinner({ id: "1238417293", user: "enriquedev", name: "EnriqueDev" });
    setShowConfetti(true);
  }

  function computedDescription(): string {
    const { description } = giveaway;

    if (description.length < 300 || fullDescription) return description;

    return giveaway.description.substr(0, 500) + "...";
  }

  const participantsList = Object.values(
    giveaway.participants.reduce((acc: Map<string, any>, participant: any) => {
      if (!acc[participant.id]) {
        acc[participant.id] = {
          count: 0,
          ...participant,
        };
      }

      acc[participant.id].count++;

      return acc;
    }, {} as Map<string, any>)
  );

  return (
    <div className={styles["giveaway-landing"]}>
      <div className={styles["twitch-user"]}>
        <a href={`https://twitch.tv/${giveaway.author.user}`} target="_blank">
          <h2>
            <InlineIcon icon={twitchIcon} />
            {giveaway.author.username}
          </h2>
        </a>
      </div>

      {showConfetti && (
        <>
          <Modal
            className={styles["winner-modal"]}
            onClose={() => setShowConfetti(false)}
          >
            <p className={styles["winner-modal-title"]}>El ganador es</p>
            <p className={styles["winner-modal-name"]}>{winner.name}</p>
          </Modal>
          <ReactConfetti
            width={document.body.offsetWidth}
            className={styles.confetti}
          />
        </>
      )}

      <div className={styles["readable-content"]}>
        <div className={styles.title}>
          <h1>{giveaway.title}</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.text}>{computedDescription()}</div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFullDescription(!fullDescription);
            }}
          >
            {fullDescription ? "Show less" : "Show more"}
          </a>
        </div>
      </div>

      {viewerIsAuthor && (
        <div
          className={`${styles["section-container"]} ${styles["pick-winner-container"]}`}
        >
          <button className={styles["pick-winner"]} onClick={pickWinner}>
            Pick a winner!
          </button>
          <p>
            End the giveaway and select a winner from the current{" "}
            {participantsList.length} participants.
          </p>
        </div>
      )}

      <div className={styles["joined-actions"]}>
        <div
          className={`${styles.container} ${styles["section-container"]} ${styles["guide"]}`}
        >
          <h2>How I join the giveaway?</h2>
          <div className={styles["guide-container"]}>
            <ChannelPointsReward
              title={giveaway.rewardInfo.title}
              cost={giveaway.rewardInfo.cost}
            />
            <span
              className={styles["guide-container-text"]}
              dangerouslySetInnerHTML={{
                __html: t("channel-point-guide", {
                  authorTwitchLink: `https://twitch.tv/${giveaway.author.user}`,
                  authorTwitchName: giveaway.author.username,
                  giveawayTitle: giveaway.rewardInfo.title,
                }),
              }}
            ></span>
          </div>
        </div>

        <div className={`${styles.container} ${styles["section-container"]}`}>
          <h2>{t("share")}</h2>
          <div className={styles.share}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(
                  `https://getskills.live/giveaway/${giveaway.author.user}`
                );
              }}
              rel="noopener"
            >
              <InlineIcon icon={copyIcon} /> Copy link
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=https://getskills.live/giveaway/${
                giveaway.author.user
              }&text=${t("share-intent")}`}
              target="_blank"
              rel="noopener"
            >
              <InlineIcon icon={twitterIcon} /> Twitter
            </a>

            <a
              href={`https://t.me/share/url?url=https://getskills.live/giveaway/${
                giveaway.author.user
              }&text=${t("share-intent")}`}
              target="_blank"
              rel="noopener"
            >
              <InlineIcon icon={telegramIcon} /> Telegram
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://getskills.live/giveaway/${
                giveaway.author.user
              }&t=${t("share-intent")}`}
              target="_blank"
              rel="noopener"
            >
              <InlineIcon icon={facebookIcon} /> Facebook
            </a>
          </div>
        </div>
      </div>

      <div className={styles["section-container"]}>
        <h2>Current Participants</h2>
        <ul className={styles.participants}>
          {participantsList.map(({ name }: { name: string }) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
