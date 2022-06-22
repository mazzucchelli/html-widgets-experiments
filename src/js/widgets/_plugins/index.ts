import { ObservableMembrane } from "observable-membrane";
import { ProxyPropertyKey } from "observable-membrane/dist/shared";
// import { WidgetContext } from "../../lib/dist/html-widgets.cjs";
import { WidgetContext } from "html-widgets";
import { z } from "zod";

import emitter from "../../events";

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
});
