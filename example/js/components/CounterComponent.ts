import { RC } from "../../../lib/helpers/ReactiveComponent";

interface CounterProps {
  delta: number;
}

export default (ctx: RC<CounterProps>) => {
  const { $el, useState } = ctx;
  const value = $el.querySelector(".js_value") as HTMLDivElement;
  // const { delta } = props;

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
