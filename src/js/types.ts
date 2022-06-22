import { WidgetFunction as BaseWidgetFunction } from "html-widgets";
import plugins from "./widgets/_plugins";

export type NotificationType = "error" | "warning" | "info" | "success";

export type WidgetFunction<T> = BaseWidgetFunction<
  T,
  ReturnType<typeof plugins>
>;
