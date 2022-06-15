import { RC } from "../../../lib/helpers/ReactiveComponent";

export default (ctx: RC<{}>) => {
  const { $el } = ctx;

  console.log("init", $el.dataset.rId);

  $el.addEventListener("click", () => {
    $el.remove();
  });

  return () => {
    console.log("destroy", $el.dataset.rId);
  };
};
