import { PropsWithChildren, useEffect } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";
import Anime from "react-anime";

// Components
import { InlineIcon } from "@iconify/react";

// Icons
import closeIcon from "@iconify/icons-fe/close";

interface ModalProps {
  onClose?: () => any;
  onBackdropClick?: () => any;
  className?: string;
}

export default function Modal({
  children,
  onClose,
  onBackdropClick,
  className,
}: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return function unmount() {
      document.body.style.overflow = "";
    };
  }, []);

  function handleBackdropClick(event: Event) {
    if (event.currentTarget !== event.target) return;

    event.stopPropagation();
    onBackdropClick && onBackdropClick();
  }

  function handleCloseClick(event: Event) {
    event.stopPropagation();
    onClose && onClose();
  }

  return (
    <div className={cn(styles.modal, className)}>
      <div
        className={styles["modal-backdrop"]}
        onClick={handleBackdropClick as any}
      >
        <Anime scale={[0, 1]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-content-header"]}>
              <button onClick={handleCloseClick as any}>
                <InlineIcon icon={closeIcon} />
              </button>
            </div>
            <div className={styles["modal-content-body"]}>{children}</div>
          </div>
        </Anime>
      </div>
    </div>
  );
}
