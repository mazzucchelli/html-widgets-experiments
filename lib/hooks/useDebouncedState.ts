import { ObservableMembrane } from "observable-membrane";
import { ProxyPropertyKey } from "observable-membrane/dist/shared";

export const useDebouncedState = <T extends object>(
  proxy: T,
  onChange: () => void,
  delay: number
): T => {
  let timer = null;
  const membrane = new ObservableMembrane({
    valueObserved(target: any, key: ProxyPropertyKey) {
      // where target is the object that was accessed
      // and key is the key that was read
      // console.log("accessed ", key, target);
    },
    valueMutated(target: any, key: ProxyPropertyKey) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        onChange();
      }, delay);
    },
  });

  return membrane.getProxy(proxy);
};
