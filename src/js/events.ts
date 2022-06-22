import { TypedEmitter } from "tiny-typed-emitter";

import { NotificationType } from "./types";

interface GlobalEventsInterface {
  notify: (type: NotificationType, msg: string) => void;
}

const emitter = new TypedEmitter<GlobalEventsInterface>();

export default emitter;
