import { NotificationType, WidgetFunction } from "../../types";
import anime from "animejs/lib/anime.es.js";

interface Props {
  type: NotificationType;
  autoClose?: number;
  hideClose?: boolean;
  hideIcon?: boolean;
}

interface TemplateData extends Props {
  content: string;
}

const notificationTemplate = (props: TemplateData) => `
  <div class="flex">
    ${!props.hideIcon ? `<div class="shrink">i</div>` : ""}
    <div>${props.content}</div>
    <div class="shrink">
      ${
        !props.hideClose
          ? `<button class="js_close-btn btn">&times;</button>`
          : ""
      }
      ${
        !props.autoClose
          ? `<div class="absolute top-0 left-0 w-full h-full pointer-events-none"></div>`
          : ""
      }
    </div>
  </div>
`;

const Notification: WidgetFunction<Props> = ({ $el, props }, { qs }) => {
  const { type, autoClose, hideClose } = props;

  const typeClass = {
    info: "notification--info",
    success: "notification--success",
    warning: "notification--warning",
    error: "notification--error",
  };

  const showAnimation = (onStart?: () => void) => {
    anime.set($el, {
      display: "flex",
      opacity: 0,
    });

    anime({
      targets: $el,
      translateX: 250,
      opacity: 1,
      delay: 200,
      begin() {
        if (onStart) onStart();
      },
    });
  };

  const closeAnimation = () => {
    anime({
      targets: $el,
      opacity: 0,
      duration: 350,
      complete() {
        $el.remove();
      },
    });
  };

  const content = $el.innerHTML;
  const template = notificationTemplate({ ...props, content });
  $el.classList.add("notification", typeClass[type]);
  $el.innerHTML = template;

  if (!hideClose) {
    const closeBtn = qs<HTMLButtonElement>(".js_close-btn");
    closeBtn.addEventListener("click", () => {
      closeAnimation();
    });
  }

  showAnimation(autoClose ? closeAnimation : undefined);
};

export default Notification;