import { parseDataset } from "../utils";
import { useState } from "./useState";

export const useProps = (element: any) => {
  const props$ = useState(parseDataset(element.dataset, "option"), () => {
    for (const [key, value] of Object.entries(props$)) {
      // TODO: update only if necessary
      element.setAttribute(`rh-option-${key}`, JSON.stringify(value));
    }
  });

  return props$;
};
