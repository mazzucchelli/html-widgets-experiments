import { WidgetFunction } from "../types";

interface Props {
  msg: string;
}

const Message: WidgetFunction<Props> = (ctx) => {
  const { $el, props } = ctx;

  $el.innerHTML = props.msg;

  return () => {
    console.log("destroyed $el", $el);
  };
};

export default Message;
