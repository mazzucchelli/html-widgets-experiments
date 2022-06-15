import { RC } from "../../../lib/helpers/ReactiveComponent";

interface createRHDataModel {
  name: string;
  template?: string;
  tag?: string;
  props?: { [x: string]: string };
}

const createRH = ({ name, template, tag, props }: createRHDataModel) => {
  const rootTag = document.createElement(tag || "div");
  rootTag.dataset.xComponent = name;

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

interface CounterProps {
  delta: number;
}

interface CounterChildren {
  increment: HTMLButtonElement;
  value: HTMLDivElement;
}

export default (ctx: RC<CounterProps, CounterChildren>) => {
  const { $el, children, props, useState } = ctx;
  const { increment, value } = children;
  const { delta } = props;

  const count_$ = useState({ value: 0 }, () => {
    value.innerText = `${count_$.value}`;
  });

  // increment.addEventListener("click", () => {
  //   count_$.value += delta;

  //   const logComponent = createRH({
  //     name: "Log",
  //     props: { something: "yo" },
  //     template: `
  //       <span>${delta} added to counter</span>
  //       <button data-x-target="close">close</button>
  //     `,
  //   });

  //   $el.appendChild(logComponent);
  // });
};
