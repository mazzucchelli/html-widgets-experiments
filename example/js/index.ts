import { ReactiveHtml } from "../../lib/helpers/componentsManager";
import { createEvents } from "../../lib/helpers/eventEmitter";

import LoginForm from "./components/LoginForm";
import TodoComponent from "./components/TodoComponent";

interface GlobalEvents {
  LOGIN: () => void;
}

new ReactiveHtml({
  components: { LoginForm, TodoComponent },
  events: createEvents<GlobalEvents>(),
});
