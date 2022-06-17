import { WidgetFunction } from "../types";
import anime from "animejs/lib/anime.es.js";

interface Props {
  type: "error" | "warning" | "info" | "success";
  msg: string;
}

const Notification: WidgetFunction<Props> = ({ $el, props }) => {
  const { type, msg } = props;

  const classes = {
    info: "notification--info",
    success: "notification--success",
    warning: "notification--warning",
    error: "notification--error",
  };

  $el.classList.add("notification", classes[type]);
  $el.innerHTML = msg;

  anime({
    targets: $el,
    translateX: 250,
  });
};

export default Notification;
