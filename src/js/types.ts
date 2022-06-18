import { WidgetFunction as BaseWidgetFunction } from "html-widgets";
import helpers from "./widgetHelpers";

export type NotificationType = "error" | "warning" | "info" | "success";

export type WidgetFunction<T> = BaseWidgetFunction<
  T,
  ReturnType<typeof helpers>
>;
