import { ObservableMembrane } from "observable-membrane";
import { ProxyPropertyKey } from "observable-membrane/dist/shared";
// import { WidgetContext } from "../../lib/dist/html-widgets.cjs";
import { WidgetContext } from "html-widgets";
import { TypedEmitter } from "tiny-typed-emitter";
import { z } from "zod";

type NotificationType = "error" | "warning" | "info" | "success";

interface GlobalEventsInterface {
  notify: (type: NotificationType, msg: string) => void;
}

const emitter = new TypedEmitter<GlobalEventsInterface>();

const observable = (
  proxy: any,
  onChange: (target: any, key: ProxyPropertyKey) => void
) => {
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
      onChange(target, key);
    },
  });
  return membrane.getProxy(proxy);
};

export default (ctx: WidgetContext<any>) => ({
  useEmitter: () => emitter,
  validateProps: (props: any, zodParser: () => z.ZodObject<any>) => {
    try {
      const schema = zodParser();
      schema.parse(props);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error(`Invalid props`, ctx.$el, err);
      }
    }
  },
  log: (...args) => {
    console.log(...args);
  },
  qs: <T extends HTMLElement>(name: string): T => {
    return ctx.$el.querySelector(name);
  },
  qsa: <T extends HTMLElement>(name: string): T[] => {
    return Array.from(ctx.$el.querySelectorAll(name));
  },
  useState: (
    proxy: any,
    onChange: (target: any, key: ProxyPropertyKey) => void
  ) => {
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
        onChange(target, key);
      },
    });
    return membrane.getProxy(proxy);
  },
  // useDebouncedState: <T extends object>(
  //   proxy: T,
  //   onChange: () => void,
  //   delay: number
  // ): T => {
  //   let timer: any = null;
  //   const membrane = new ObservableMembrane({
  //     valueObserved(target: any, key: ProxyPropertyKey) {
  //       // where target is the object that was accessed
  //       // and key is the key that was read
  //       // console.log("accessed ", key, target);
  //     },
  //     valueMutated(target: any, key: ProxyPropertyKey) {
  //       if (timer) {
  //         clearTimeout(timer);
  //         timer = null;
  //       }
  //       timer = setTimeout(() => {
  //         onChange();
  //       }, delay);
  //     },
  //   });
  //   return membrane.getProxy(proxy);
  // },
});
