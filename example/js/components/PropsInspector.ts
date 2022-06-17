import { WidgetFunction } from "../types";

const PropsInspector: WidgetFunction<{}> = (ctx) => {
  const { $el, props } = ctx;

  for (const [key, value] of Object.entries(props)) {
    const $pre = document.createElement("pre");
    $pre.innerText = `${key} (${typeof value}): ${value}`;
    $el.appendChild($pre);
  }

  return () => {
    console.log("destroyed $el", $el);
  };
};

export default PropsInspector;
