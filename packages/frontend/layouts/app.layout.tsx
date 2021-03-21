import styles from "./app.layout.module.scss";
import Footer from "components/footer";
import { logout } from "infrastructure/api";
import { useRouter } from "next/router";
import useUser from "lib/use-user";
import ContextualMenu from "components/contextual-menu";
import {
  faCaretDown,
  faSignOutAlt,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useState } from "react";
import { useToasts } from "react-toast-notifications";
import Link from "next/link";
import { InlineIcon } from "@iconify/react";
import homeIcon from "@iconify/icons-mdi-light/home";
import trophyIcon from "@iconify/icons-mdi-light/trophy";
import bullhornIcon from "@iconify/icons-mdi-light/bullhorn";
import cogIcon from "@iconify/icons-mdi-light/cog";
import cn from "classnames";

interface AppLayoutProps {
  title: string;
  disableDefaultBackground?: boolean;
}

export default function AppLayout({
  children,
  title,
  disableDefaultBackground,
}: PropsWithChildren<AppLayoutProps>) {
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
      icon: homeIcon,
      label: "Home",
      href: "/app",
    },
    {
      icon: trophyIcon,
      label: "Channel Points Giveaway",
      href: "/app/channel-points-giveaway",
    },
    {
      icon: cogIcon,
      label: "WebHooks",
      href: "/app/bits-giveaway",
      soon: true,
    },
    {
      icon: trophyIcon,
      label: "Bits Giveaway",
      href: "/app/bits-giveaway",
      soon: true,
    },
    {
      icon: bullhornIcon,
      label: "Channel Points Bids",
      href: "/app/channel-points-bids",
      soon: true,
    },
    {
      icon: bullhornIcon,
      label: "Channel Points Discord",
      href: "/app/channel-points-discord",
      soon: true,
    },
  ];

  function openContextualMenu() {
    contextualMenu.show();
  }

  return (
    <div
      className={cn(
        styles["app-layout"],
        disableDefaultBackground && styles["disable-default-background"]
      )}
    >
      <main>
        <div className={styles["container"]}>
          <aside>
            <p className={styles["title"]}>GetSkills.live</p>
            <nav className={styles["links"]}>
              <ul>
                {MENU_LINKS.map((link, index) => {
                  const content = (
                    <>
                      <span>
                        <span className={styles["icon"]}>
                          <InlineIcon icon={link.icon} />
                        </span>
                        {link.label}
                      </span>
                      {link.soon && (
                        <span className={styles["soon-label"]}>Soon!</span>
                      )}
                    </>
                  );

                  const classNames = cn(
                    router.pathname === link.href && styles.active,
                    link.soon && styles.soon
                  );

                  if (!link.soon) {
                    return (
                      <Link href={link.href} key={index}>
                        <li className={classNames}>{content}</li>
                      </Link>
                    );
                  }

                  return (
                    <li className={classNames} key={index}>
                      {content}
                    </li>
                  );
                })}
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
