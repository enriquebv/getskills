import styles from "./app.layout.module.scss";
import Footer from "components/footer";
import { logout } from "infrastructure/api";
import { useRouter } from "next/dist/client/router";
import useUser from "lib/use-user";
import ContextualMenu from "components/contextual-menu";
import {
  faCaretDown,
  faSignOutAlt,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function AppLayout({ children, title }) {
  const router = useRouter();
  const { user, isLoading } = useUser();
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
    router.push("/");
  }

  function openContextualMenu() {
    contextualMenu.show();
  }

  return (
    <div className={styles["app-layout"]}>
      <main>
        <div className={styles["container"]}>
          <aside></aside>
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
