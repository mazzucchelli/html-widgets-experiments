import { ListenerSignature, TypedEmitter } from "tiny-typed-emitter";

export const createEvents = <T>() => new TypedEmitter<ListenerSignature<T>>();
