import HtmlWidgets from "../../../../lib/dist/html-widgets.cjs";
import plugins from "../../src/js/widgetHelpers";

export const initWidgets = (widgets) => {
  new HtmlWidgets({
    lazyImport: () => Promise.reject(),
    widgets,
    logs: true,
    plugins,
    selector: "[sb-show-main]",
  });
};
