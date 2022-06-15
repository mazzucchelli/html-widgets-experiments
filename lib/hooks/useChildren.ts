export const useChild = <T extends HTMLElement>(
  element: HTMLElement,
  name: string
): T => {
  return element.querySelector(`[rh-child="${name}"]`) as T;
};

export const useChildren = (element: HTMLElement, name: string) => {
  return element.querySelectorAll(`[rh-child="${name}"]`);
};
