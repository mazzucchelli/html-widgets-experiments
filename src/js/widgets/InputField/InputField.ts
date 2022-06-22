import { z } from "zod";
import { WidgetFunction } from "../../types";

interface Props {
  touched: boolean;
  error: string;
}

const PropsSchema = z.object({
  touched: z.boolean(),
  error: z.string().or(z.nan()),
});

const InputField: WidgetFunction<Props> = (
  { $el, props, propEffect },
  { qs, validateProps }
) => {
  validateProps(props, () => PropsSchema);

  const $input = qs<HTMLInputElement>("input");

  const [error] = propEffect("error", () => {
    const $feedback = qs<HTMLDivElement | undefined>("feedback");

    if (!error.current && $feedback) {
      $feedback.remove();
    }

    if ($feedback) {
      $feedback.innerText = error.current;
      return;
    }

    const $newFeedbackDiv = document.createElement("div");
    $newFeedbackDiv.classList.add("feedback");
    $newFeedbackDiv.innerText = error.current;

    $el.append($newFeedbackDiv);
  });

  const [, setTouched] = propEffect("touched", () => {});

  $input.addEventListener("blur", () => {
    setTouched(true);
  });
};

export default InputField;
