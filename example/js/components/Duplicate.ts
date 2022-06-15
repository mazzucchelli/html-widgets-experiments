import { RC } from "../../../lib/helpers/ReactiveComponent";

export default (ctx: RC<{}>) => {
  const { $el } = ctx;

  $el.addEventListener("click", () => {
    $el.remove();
  });
};
