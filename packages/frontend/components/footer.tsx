import styles from "./footer.module.scss";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["container"]}>
        <nav className={styles["left"]}>
          <Link href="/contact">Contact</Link>
          <a target="_blank" href="https://www.twitch.tv/enriquedev">
            Built live in{" "}
            <span className={styles.accent}>twitch/enriquedev</span>
          </a>
        </nav>
        <nav className={styles["right"]}>
          <Link href="/cookie-tos">Cookies & Terms of Service</Link>
          <Link href="/cookie-tos">Roadmap</Link>
        </nav>
      </div>
    </footer>
  );
}
