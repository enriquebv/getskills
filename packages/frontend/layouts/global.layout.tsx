import Link from "next/link";
import styles from "./global.layout.module.scss";

export default function GlobalLayout({ children }): JSX.Element {
  return (
    <div className={styles["global-layout"]}>
      {/* Header */}
      <header>
        <div className={styles["container"]}>
          <Link href="/">
            <p className={styles["logo"]}>GetSkills.live</p>
          </Link>
          <nav>
            <a href="#" className={styles["active"]}>
              Login
            </a>
            <a href="#">Features</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main>
        <div className={styles["container"]}>{children}</div>
      </main>

      {/* Footer */}
      <footer>
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
    </div>
  );
}
