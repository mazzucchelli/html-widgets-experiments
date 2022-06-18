import { WidgetFunction } from "../../types";
import { createWidget } from "html-widgets";

const Notification: WidgetFunction<{}> = ({ $el }, { useEmitter }) => {
  const emitter = useEmitter();

  emitter.on("notify", (type, msg) => {
    const Message = createWidget({
      name: "Notification",
      props: {
        type,
      },
      template: msg,
    });

    Message.style.display = "none";
    $el.appendChild(Message);
  });
};

export default Notification;
