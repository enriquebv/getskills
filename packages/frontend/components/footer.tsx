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
          <Link href="/contact">Contact</Link>
          <a target="_blank" href="https://www.twitch.tv/enriquedev">
            {t("built-live-in")}{" "}
            <span className={styles.accent}>twitch/enriquedev</span>
          </a>
          <Link href="/cookie-tos">Roadmap</Link>
        </nav>
        <nav className={styles["right"]}>
          <Link href={router.pathname} locale="en">
            English
          </Link>
          <Link href={router.pathname} locale="es">
            Español
          </Link>
          <Link href="/cookie-tos">{t("cookies-terms")}</Link>
        </nav>
      </div>
    </footer>
  );
}
