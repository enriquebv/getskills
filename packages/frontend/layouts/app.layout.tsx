import styles from "./app.layout.module.scss";
import Footer from "components/footer";
import { logout } from "infrastructure/api";
import { useRouter } from "next/router";
import useUser from "lib/use-user";
import ContextualMenu from "components/contextual-menu";
import {
  faAddressBook,
  faCaretDown,
  faSignOutAlt,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

export default function AppLayout({ children, title }) {
  const router = useRouter();
  const { addToast } = useToasts();

  const { user } = useUser({
    redirect: true,
  });
  const [contextualMenu, setContextualMenu] = useState(null);

  const profileOptions = [
    {
      label: "Profile",
      icon: faUserAlt,
      handler() {
        console.info("user");
      },
    },
    {
      label: "Logout",
      icon: faSignOutAlt,
      handler: doLogout,
    },
  ];

  async function doLogout() {
    await logout();
    addToast("You logged out.", {
      appearance: "info",
      autoDismiss: true,
    });
    router.push("/");
  }

  const MENU_LINKS = [
    {
      icon: faChartBar,
      label: "Dashboard",
      href: "/app",
    },
    {
      icon: faAddressBook,
      label: "Giveaway",
      href: "/app/giveaway",
    },
  ];

  function openContextualMenu() {
    contextualMenu.show();
  }

  return (
    <div className={styles["app-layout"]}>
      <main>
        <div className={styles["container"]}>
          <aside>
            <p className={styles["title"]}>GetSkills.live</p>
            <nav className={styles["links"]}>
              <ul>
                {MENU_LINKS.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <li
                      className={
                        router.pathname === link.href ? styles.active : ""
                      }
                    >
                      <FontAwesomeIcon icon={link.icon} />
                      {link.label}
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>
          </aside>
          <div className={styles["content"]}>
            <header>
              <h1>{title}</h1>
              <div className={styles["actions"]}>
                <ContextualMenu
                  options={profileOptions}
                  onCreate={setContextualMenu}
                >
                  <b>
                    {user?.username || "Loading..."}{" "}
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className={styles["icon"]}
                    />
                  </b>
                </ContextualMenu>

                {user && (
                  <div
                    onClick={openContextualMenu}
                    style={{ backgroundImage: `url(${user.avatar})` }}
                    className={styles["avatar"]}
                  ></div>
                )}
                {!user && (
                  <div
                    onClick={openContextualMenu}
                    className={`${styles["avatar"]} ${
                      !user && styles["skeleton"]
                    }`}
                  ></div>
                )}
              </div>
            </header>
            <section>{children}</section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
