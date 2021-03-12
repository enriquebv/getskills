import { ChangeEventHandler } from "react";

interface InputProps {
  placeholder?: string;
  onChange?: ChangeEventHandler;
  onTextChange?: (arg0: string) => any;
}

export default function Input({
  placeholder,
  onTextChange,
  onChange,
}: InputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(event) => {
        if (onChange) onChange(event);

        if (onTextChange) {
          const target = event.target as HTMLInputElement;
          onTextChange(target.value);
        }
      }}
    />
  );
}
