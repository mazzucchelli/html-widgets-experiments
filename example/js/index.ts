import { ReactiveHtml } from "../../lib/helpers/componentsManager";
import createRH from "../../lib/helpers/createComponent";

import Log from "./components/Log";

new ReactiveHtml({
  components: {
    Log,
  },
  asyncComponents: { Duplicate: `Duplicate.ts` },
  logs: true,
});

// demo porposes only
document.querySelector(".js_add").addEventListener("click", () => {
  const newComp = createRH({
    name: "Duplicate",
    className: "dup",
  });

  document.querySelector("[data-r-root]").appendChild(newComp);
});
