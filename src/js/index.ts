// import HtmlWidgets from "../../lib/dist/html-widgets.cjs";
import HtmlWidgets from "html-widgets";
import plugins from "./widgetHelpers";
import "../css/tailwind.css";

new HtmlWidgets({
  lazyImport: async (widget) => await import(`~/${widget}/${widget}`),
  logs: true,
  plugins,
});
