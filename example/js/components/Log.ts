import { RC } from "../../../lib/helpers/ReactiveComponent";

interface CounterChildren {
  close: HTMLButtonElement;
}

export default (ctx: RC<{}, CounterChildren>) => {
  const { $el, children } = ctx;
  const { close } = children;

  close.addEventListener("click", () => {
    $el.remove();
  });
};
