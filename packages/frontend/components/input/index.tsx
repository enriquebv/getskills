import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import cn from "classnames";

interface InputProps {
  placeholder?: string;
  onChange?: ChangeEventHandler;
  onValueChange?: (arg0: any) => any;
  className?: string;
  size?: "big" | "normal" | "small";
  getRef?: ({ input }: { input: HTMLInputElement }) => any;
  invalid?: boolean | string;
  disabled?: boolean;
  value?: string | number;
  number?: boolean;
  max?: number;
}

export default function Input({
  placeholder,
  onValueChange,
  onChange,
  className,
  size,
  getRef,
  invalid,
  disabled,
  value,
  number,
  max,
}: InputProps) {
  const [refered, setRefered] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refered) return;
    if (getRef) getRef({ input: input.current });
    setRefered(true);
  }, [getRef]);

  return (
    <div
      className={cn(
        styles["ui-input"],
        className,
        size === "big" && styles.big,
        size === "small" && styles.small,
        invalid && styles.invalid,
        disabled && styles.disabled
      )}
    >
      <input
        value={value}
        ref={input}
        type={number ? "number" : "text"}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => {
          if (onChange) onChange(event);

          if (onValueChange && !number) {
            const target = event.target as HTMLInputElement;
            onValueChange(target.value);
          }

          if (onValueChange && number) {
            const target = event.target as HTMLInputElement;
            const numberValue = Number(target.value);
            let realValue = max && numberValue > max ? max : numberValue;

            onValueChange(realValue);
          }
        }}
      />
      {typeof invalid === "string" && (
        <span className={styles["invalid-label"]}>{invalid}</span>
      )}
    </div>
  );
}
