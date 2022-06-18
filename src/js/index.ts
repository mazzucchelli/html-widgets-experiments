import HtmlWidgets from "html-widgets";
import plugins from "./widgetHelpers";
import "../css/styles.css";

new HtmlWidgets({
  lazyImport: async (widget) => await import(`~/${widget}/${widget}`),
  logs: true,
  plugins,
});
