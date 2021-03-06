import Link from "next/link";
import styles from "./global.layout.module.scss";
import Footer from "components/footer";

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

      <Footer />
    </div>
  );
}
