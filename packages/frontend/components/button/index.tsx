import { MouseEvent, PropsWithChildren, useRef } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";

interface Props {
  className?: string;
  onClick?(event: MouseEvent<HTMLButtonElement>): any;
  variant?: "normal" | "outline";
  color?: "normal" | "red";
}

export default function UiButton({
  className,
  children,
  onClick,
  variant,
  color,
}: PropsWithChildren<Props>) {
  const ref = useRef(null);

  function handleOnClick(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
    onClick(event);
  }

  return (
    <button
      ref={ref}
      className={cn(
        styles["ui-button"],
        className,
        styles[variant || "normal"],
        styles[color || "normal"]
      )}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
}
