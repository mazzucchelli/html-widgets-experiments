import HtmlWidgets from "html-widgets";

import Notification from "../Notification/Notification";
import plugins from "../_plugins";

new HtmlWidgets({
  lazyImport: () => Promise.resolve(),
  widgets: {
    Notification,
  },
  logs: true,
  plugins,
  rootElement: "#root",
});

export default {
  title: "Example/Notifications",
  argTypes: {
    type: { control: "text" },
    msg: { control: "text" },
  },
};

const Template = ({ type, msg }) => {
  return `
        <div data-widget="Notification" :type="${type}">${msg}</div>
    `;
};
export const Info = Template.bind({});
Info.parameters = {
  docs: {
    source: {
      code: Template({
        type: Info?.args?.type,
        msg: Info?.args?.msg,
      }),
    },
  },
};
Info.args = {
  type: "info",
  msg: "lorem ipsum dolor sit amet",
};

Info.args = {
  type: "warn",
  msg: "lorem ipsum dolor sit amet",
};

Info.args = {
  type: "success",
  msg: "lorem ipsum dolor sit amet",
};

Info.args = {
  type: "error",
  msg: "lorem ipsum dolor sit amet",
};
