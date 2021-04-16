import Link from "next/link";
import styles from "./global.layout.module.scss";
import Footer from "components/footer";
import useUser from "lib/use-user";
import oauthTwithUrl from "lib/twitch-oauth-url";
import { logout } from "infrastructure/api";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useChangeLocale } from "lib/i18n";

export default function GlobalLayout({ children }): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const { addToast } = useToasts();
  const { t } = useTranslation("common");
  const { change } = useChangeLocale();

  function handleLocaleChange(event: any, locale: string) {
    (event as MouseEvent).preventDefault();
    change(locale);
  }

  return (
    <div className={styles["global-layout"]}>
      {/* Header */}
      <header>
        <div className={styles["container"]}>
          <Link href="/">
            <p className={styles["logo"]}>GetSkills.live</p>
          </Link>
          <nav>
            <a href="/contact">{t("contact")}</a>
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
              {user ? t("logout") : t("login")}
            </a>
            <p className={styles["lang"]}>
              <span>
                <a href="#" onClick={(e) => handleLocaleChange(e, "en")}>
                  <span
                    className={
                      router.locale === "en" ? styles["active"] : undefined
                    }
                  >
                    EN
                  </span>
                </a>
              </span>
              <span className={styles["separator"]}>|</span>
              <span>
                <a href="#" onClick={(e) => handleLocaleChange(e, "es")}>
                  <span
                    className={
                      router.locale === "es" ? styles["active"] : undefined
                    }
                  >
                    ES
                  </span>
                </a>
              </span>
            </p>
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
