import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useRef, useState } from "react";

interface OptionInterface {
  label: string;
  icon: IconDefinition;
  handler: () => any;
}

function ContextualMenuItem({ option }): JSX.Element {
  return (
    <li onClick={option.handler}>
      <FontAwesomeIcon icon={option.icon} /> {option.label}
    </li>
  );
}

export default function ContextualMenu({
  children,
  options = [] as OptionInterface[],
  onCreate = null as Function,
}) {
  return (
    <Tippy
      className="contextual-menu"
      onCreate={(tip) => onCreate(tip)}
      content={
        <ul>
          {options.map((option: OptionInterface) => (
            <ContextualMenuItem option={option} key={option.label} />
          ))}
        </ul>
      }
      interactive={true}
      trigger="click"
      placement="bottom"
      theme="light"
    >
      <span>{children}</span>
    </Tippy>
  );
}
