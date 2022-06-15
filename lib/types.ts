import { ListenerSignature, TypedEmitter } from "tiny-typed-emitter";

type CleanUpFunction = () => void;
type RhElement<T> = T extends HTMLElement ? T : never;
type ComponentHelpers<Children, Tag> = {
  useEmit: any;
  useSubscribe: any;
  useDebouncedState: any;
  useChildren: <T extends HTMLElement, All = false>(
    element: Tag,
    name: keyof Children
  ) => All extends true ? T[] : T;
  useState: <T extends object>(proxy: T, onChange: () => void) => T;
};

type RCArgs<Props, Children, Tag> = {
  element: RhElement<Tag>;
  children: Children;
  props?: Props;
  helpers: ComponentHelpers<Children, Tag>;
};

export type RC<Props, Children, Tag> = (
  args: RCArgs<Props, Children, Tag>
) => CleanUpFunction | void;

export interface ReactiveHtmlConfigs {
  events: <T>() => TypedEmitter<ListenerSignature<T>>;
  components: { [x: string]: RC<unknown, unknown, HTMLElement> };
}
