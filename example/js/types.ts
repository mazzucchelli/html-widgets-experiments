import { WidgetFunction as BaseWidgetFunction } from "html-widgets";
import helpers from "./widgetHelpers";

export type WidgetFunction<T> = BaseWidgetFunction<
  T,
  ReturnType<typeof helpers>
>;
