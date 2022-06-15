import { RC } from "../../../lib/helpers/ReactiveComponent";

interface CounterChildren {
  close: HTMLButtonElement;
}

export default (ctx: RC<{}, CounterChildren>) => {
  const { $el, children } = ctx;
  // const { close } = children;

  $el.addEventListener("click", () => {
    $el.remove();
  });
};
