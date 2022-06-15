import { ObservableMembrane } from "observable-membrane";
import { ProxyPropertyKey } from "observable-membrane/dist/shared";

export const useState = <T extends object>(
  proxy: T,
  onChange: () => void
): T => {
  const membrane = new ObservableMembrane({
    valueObserved(target: any, key: ProxyPropertyKey) {
      // where target is the object that was accessed
      // and key is the key that was read
      // console.log("accessed ", key, target);
    },
    valueMutated(target: any, key: ProxyPropertyKey) {
      // where target is the object that was mutated
      // and key is the key that was mutated
      // console.log("mutated ", key, target);
      onChange();
    },
  });

  return membrane.getProxy(proxy);
};
