import { z } from "zod";
import { NotificationType, WidgetFunction } from "../../types";

interface Props {
  type: NotificationType;
  msg: string;
}

const NotificationTrigger: WidgetFunction<Props> = (
  { $el, props },
  { useEmitter, validateProps }
) => {
  const { type, msg } = props;

  validateProps(props, () => {
    return z.object({
      type: z.enum(["error", "warning", "info", "success"]),
      msg: z.string(),
    });
  });

  const emitter = useEmitter();

  $el.addEventListener("click", () => emitter.emit("notify", type, msg));
};

export default NotificationTrigger;
