import HtmlWidgets from "html-widgets";
import plugins from "./widgetHelpers";

import Message from "./components/Message";

new HtmlWidgets({
  lazyImport: async (widget) => await import(`~/${widget}`),
  logs: true,
  plugins,
  widgets: {
    Message,
  },
});
