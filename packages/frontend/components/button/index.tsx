import { MouseEvent, PropsWithChildren, useRef } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";

interface Props {
  className?: string;
  onClick?(event: MouseEvent<HTMLButtonElement>): any;
  variant?: string;
}

export default function UiButton({
  className,
  children,
}: PropsWithChildren<Props>) {
  const ref = useRef(null);

  function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
  }

  return (
    <button
      ref={ref}
      className={cn(styles["ui-button"], className)}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
}
