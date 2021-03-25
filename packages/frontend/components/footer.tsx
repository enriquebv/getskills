import styles from "./footer.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");
  const router = useRouter();

  return (
    <footer className={styles["footer"]}>
      <div className={styles["container"]}>
        <nav className={styles["left"]}>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/roadmap">Roadmap</Link>
          <a target="_blank" href="https://www.twitch.tv/enriquedev">
            {t("built-live-in")}{" "}
            <span className={styles.accent}>twitch/enriquedev</span>
          </a>
        </nav>
        <nav className={styles["right"]}>
          <Link href={router.pathname} locale="en">
            English
          </Link>
          <Link href={router.pathname} locale="es">
            Español
          </Link>
          <span>
            <Link href="/cookie-terms">{t("cookies-terms")}</Link> |{" "}
            <Link href="/privacy">{t("privacy")}</Link>
          </span>
        </nav>
      </div>
    </footer>
  );
}
