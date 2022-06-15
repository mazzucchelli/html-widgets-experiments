import { ReactiveHtml } from "../../lib/helpers/componentsManager";
import { createEvents } from "../../lib/helpers/eventEmitter";

import LoginForm from "./components/LoginForm";
import TodoComponent from "./components/TodoComponent";

interface GlobalEvents {
  LOGIN: () => void;
}

new ReactiveHtml({
  components: { LoginForm, TodoComponent },
  events: createEvents<GlobalEvents>(),
});

interface createRHDataModel {
  name: string;
  className?: string;
  template?: string;
  tag?: string;
  props?: { [x: string]: string };
}

const createRH = ({
  name,
  template,
  tag,
  props,
  className,
}: createRHDataModel) => {
  const rootTag = document.createElement(tag || "div");
  rootTag.dataset.r = name;

  if (className) {
    rootTag.classList.add(className);
  }

  if (template) {
    rootTag.innerHTML = template;
  }

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      rootTag.dataset[key] = value;
    }
  }

  return rootTag;
};

document.querySelector(".js_add").addEventListener("click", () => {
  const newComp = createRH({
    name: "Duplicate",
    className: "dup",
  });

  document.querySelector("[data-r-root]").appendChild(newComp);
});
