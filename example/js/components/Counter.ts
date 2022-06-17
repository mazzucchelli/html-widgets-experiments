import { createWidget } from "html-widgets";
import { WidgetFunction } from "../types";

interface CounterProps {
  "initial-value": number;
  step: number;
}

const Counter: WidgetFunction<CounterProps> = (ctx, helpers) => {
  const { $el, props } = ctx;
  const { useState, qs } = helpers;

  const DOM = {
    incrementBtn: qs<HTMLButtonElement>(".js_increment"),
    decrementBtn: qs<HTMLButtonElement>(".js_decrement"),
    valueEl: qs<HTMLSpanElement>(".js_value"),
  };

  const count_$ = useState({ value: 0 }, () => {
    DOM.valueEl.innerText = `${count_$.value}`;
  });

  const notify = (msg: string) => {
    const Message = createWidget({
      name: "Message",
      props: {
        msg,
      },
    });
    document.querySelector("[data-widgets-root]").appendChild(Message);
  };

  count_$.value = props["initial-value"];

  DOM.incrementBtn.addEventListener("click", () => {
    count_$.value += props.step;
    notify("increment");
  });

  DOM.decrementBtn.addEventListener("click", () => {
    count_$.value -= props.step;
    notify("decrement");
  });

  return () => {
    console.log("destroyed $el", $el);
  };
};

export default Counter;
