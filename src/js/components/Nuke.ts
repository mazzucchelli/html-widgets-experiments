import { WidgetFunction } from "../types";

const Nuke: WidgetFunction<{}> = (ctx) => {
  const { $el } = ctx;

  $el.addEventListener("click", () => {
    document.querySelector("[data-widgets-root]").innerHTML = "";
  });
};

export default Nuke;
