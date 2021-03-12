import Link from "next/link";
import styles from "./global.layout.module.scss";
import Footer from "components/footer";
import useUser from "lib/use-user";
import oauthTwithUrl from "lib/twitch-oauth-url";
import { logout } from "infrastructure/api";
import { useToasts } from "react-toast-notifications";

export default function GlobalLayout({ children }): JSX.Element {
  const { user } = useUser();
  const { addToast } = useToasts();

  return (
    <div className={styles["global-layout"]}>
      {/* Header */}
      <header>
        <div className={styles["container"]}>
          <Link href="/">
            <p className={styles["logo"]}>GetSkills.live</p>
          </Link>
          <nav>
            <a
              href={oauthTwithUrl}
              onClick={async (event) => {
                if (user) {
                  event.preventDefault();
                  await logout();
                  addToast("You logged out.", {
                    appearance: "info",
                    autoDismiss: true,
                  });
                }
              }}
              className={styles["active"]}
            >
              {user ? "Logout" : "Login"}
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
