import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import cn from "classnames";

const MAX_TITLE_CHARS = 27;

interface ChannelPointsReward {
  title?: string;
  cost?: number;
  placeholder?: string;
  skeleton?: boolean;
}

export default function ChannelPointsReward({
  title,
  cost,
  placeholder,
  skeleton,
}: ChannelPointsReward) {
  const router = useRouter();

  function shortTitle(title) {
    return title.length > MAX_TITLE_CHARS
      ? `${title.substr(0, MAX_TITLE_CHARS)}...`
      : title;
  }

  function computedTitle() {
    if (!title && router.locale === "en")
      return shortTitle(`Giveaway "${placeholder || "Without title"}"`);
    if (!title && router.locale === "es")
      return shortTitle(`Sorteo "${placeholder || "Sin titulo"}"`);

    return shortTitle(title);
  }

  return (
    <div
      className={cn(
        styles["channel-points-reward"],
        skeleton && styles.skeleton
      )}
    >
      <div className={styles.box}>
        <img src="/default-icon-channel.png" />
        <span className={styles.cost}>{skeleton ? 2000 : cost}</span>
      </div>
      <span className={styles.title}>
        {skeleton ? "Skeleton title" : computedTitle()}
      </span>
    </div>
  );
}
