import ReactTextareaAutosize from "react-textarea-autosize";
import styles from "./styles.module.scss";
import cn from "classnames";

interface TextareaProps {
  placeholder?: string;
  onValueChange?: (arg0: string) => any;
  contrast?: boolean;
  invalid?: boolean | string;
  disabled?: boolean;
  value?: string;
  className?: string;
}

export default function Textarea({
  placeholder,
  onValueChange,
  contrast,
  invalid,
  disabled,
  value,
  className,
}: TextareaProps) {
  function onChange(event) {
    onValueChange(event.target.value);
  }

  return (
    <div
      className={cn(
        styles["ui-textarea"],
        contrast && styles["contrast"],
        invalid && styles.invalid,
        disabled && styles.disabled,
        className
      )}
    >
      <ReactTextareaAutosize
        value={value}
        readOnly={disabled}
        minRows={5}
        placeholder={placeholder}
        onChange={onChange}
      />
      {typeof invalid === "string" && (
        <span className={styles["invalid-label"]}>{invalid}</span>
      )}
    </div>
  );
}
