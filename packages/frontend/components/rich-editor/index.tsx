import dynamic from "next/dynamic";
import { useState } from "react";
import EditorComponent from "react-medium-editor";
const Editor = dynamic(() => import("react-medium-editor"), {
  ssr: false,
}) as EditorComponent;

const toolbarOptions = {
  toolbar: { buttons: ["bold", "underline", "anchor", "h2"] },
};

export default function RichEditor() {
  const [text, setText] = useState("");

  function onChange(text: string) {
    setText(text);
  }

  return <Editor text={text} onChange={onChange} options={toolbarOptions} />;
}
