import { RC } from "../../../lib/helpers/ReactiveComponent";

export default (ctx: RC<{}>) => {
  const { $el } = ctx;
  // const { close } = children;

  $el.addEventListener("click", () => {
    $el.remove();
  });
};
