import { RC } from "../../../lib/helpers/ReactiveComponent";

interface CounterChildren {
  $emailInput: HTMLInputElement;
  $passwordInput: HTMLInputElement;
  $rememberFlag: HTMLInputElement;
  $submitButton: HTMLButtonElement;
}

export default ({ $el, children }: RC<{}, CounterChildren>) => {
  //   const { $emailInput, $passwordInput, $rememberFlag, $submitButton } =
  //     children;

  $el.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(children);
  });
};
