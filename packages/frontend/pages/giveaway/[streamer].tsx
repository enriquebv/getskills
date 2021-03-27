import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import SSRError from "lib/ssr-error";
import { mapTranslationProps } from "lib/server-side-translation";

// Styles
import styles from "./styles.module.scss";

// Api
import { pickWinnerGiveaway } from "infrastructure/api";
import { getGiveawayByUser } from "infrastructure/api";

// Hooks
import useUser from "lib/use-user";
import { useTranslation } from "react-i18next";

// Icons
import facebookIcon from "@iconify/icons-brandico/facebook";
import twitterIcon from "@iconify/icons-brandico/twitter-bird";
import copyIcon from "@iconify/icons-mdi-light/content-duplicate";
import telegramIcon from "@iconify/icons-bx/bxl-telegram";
import twitchIcon from "@iconify/icons-bx/bxl-twitch";

// Components
import { InlineIcon } from "@iconify/react";
import Modal from "components/modal";
import ReactConfetti from "react-confetti";
import ChannelPointsReward from "components/channel-points-reward";
import Footer from "components/footer";

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
    return { props: { giveaway: response.data, ...i18nProps, streamer } };
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
}: {
  giveaway: any;
  ssrError: SSRError;
}) {
  if (!giveaway) {
    return (
      <div
        className={`${styles["giveaway-landing"]} ${styles["giveaway-center"]}`}
      >
        <h1>Giveaway not found</h1>
      </div>
    );
  }

  const { user } = useUser();
  const { t } = useTranslation("giveaway");
  const viewerIsAuthor = user?.id === giveaway.author?.id;
  const [fullDescription, setFullDescription] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (giveaway.winner) setWinner(giveaway.winner);
  }, [giveaway]);

  async function pickWinner() {
    const response = await pickWinnerGiveaway(giveaway.id);
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
    setWinner(response.data);
    setShowConfetti(true);
  }

  // Returns short or long HTML giveaway description
  function computedDescription(): string {
    const description = giveaway.description.split("\n").join("<br/>");

    if (description.length < 300 || fullDescription) return description;

    return giveaway.description.substr(0, 500) + "...";
  }

  // List of participants without duplicates
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
      <div className={styles["giveaway-landing-body"]}>
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
              <p className={styles["winner-modal-title"]}>{t("winner-is")}</p>
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
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html: computedDescription(),
              }}
            ></div>
            {giveaway.description.length > 300 && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setFullDescription(!fullDescription);
                }}
              >
                {fullDescription ? "Show less" : "Show more"}
              </a>
            )}
          </div>
        </div>

        {viewerIsAuthor && !showConfetti && !winner && giveaway.active && (
          <div
            className={`${styles["section-container"]} ${styles["pick-winner-container"]}`}
          >
            <button
              className={styles["pick-winner"]}
              onClick={pickWinner}
              disabled={participantsList.length === 0}
            >
              {t("pick-winner")}
            </button>
            <p>
              {participantsList.length === 0 ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t("more-participants-text"),
                  }}
                ></span>
              ) : (
                <span>{t("end-text", { count: participantsList.length })}</span>
              )}
            </p>
          </div>
        )}

        {winner && !showConfetti && (
          <div
            className={`${styles["section-container"]} ${styles["winner-container"]}`}
            dangerouslySetInnerHTML={{
              __html: t("persistent-winner-is", { winner: winner.name }),
            }}
          ></div>
        )}

        <div className={styles["joined-actions"]}>
          {/* Join giveaway */}
          {!winner && (
            <div
              className={`${styles.container} ${styles["section-container"]} ${styles["guide"]}`}
            >
              <h2>{t("how-join")}</h2>
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
          )}

          {/* Share options */}
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
                <InlineIcon icon={copyIcon} /> {t("share-copy")}
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

        {/* Current participants */}
        {!winner && giveaway.active && (
          <>
            <div className={styles["section-container"]}>
              <h2>{t("current-participants")}</h2>
              <ul className={styles.participants}>
                {participantsList.length === 0 && (
                  <li>{t("be-the-first-to-join-the-giveaway")}</li>
                )}
                {participantsList.map(({ name }: { name: string }) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <Footer className={styles.footer} showSiteName />
    </div>
  );
}
