import { NotificationType, WidgetFunction } from "../../types";

interface Props {
  type: NotificationType;
  msg: string;
}

const NotificationTrigger: WidgetFunction<Props> = (
  { $el, props },
  { useEmitter }
) => {
  const { type, msg } = props;
  const emitter = useEmitter();

  $el.addEventListener("click", () => emitter.emit("notify", type, msg));
};

export default NotificationTrigger;
