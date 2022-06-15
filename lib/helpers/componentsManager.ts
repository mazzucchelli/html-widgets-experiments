import { ReactiveComponent } from "./ReactiveComponent";
import { ListenerSignature } from "tiny-typed-emitter";

const COMPONENT_LIST = new Map();

export class ReactiveHtml {
  private components: any;
  private events: ListenerSignature<unknown>;
  private importer: () => Promise<any> | null;
  private rootElement: HTMLElement;
  private selector: any;

  constructor({
    components,
    events,
    importer = null,
    rootElement = `[data-r-root]`,
    selector = `[data-r]`,
  }) {
    this.rootElement = document.body.querySelector(rootElement);
    this.selector = selector;
    this.components = components;
    this.importer = importer;
    this.events = events;

    this.init();
  }

  afterNodeDeleted(removedNodes) {
    // const removed = removedNodes.querySelectorAll(this.selector);

    // console.log(
    //   `%c- [${removed.length}]`,
    //   "color: white; background-color: #9c27b0; padding: 3px 5px;"
    // );

    removedNodes
      .filter((el) => el.dataset.rId)
      .forEach((comp) => {
        const { rId } = comp.dataset;

        if (COMPONENT_LIST.has(rId)) {
          const instance = COMPONENT_LIST.get(rId);
          instance.destroy();
          COMPONENT_LIST.delete(rId);
        }
      });
  }

  afterNodeAdded(addedNodes: HTMLElement[]) {
    addedNodes
      .filter((el) => !!el.querySelectorAll)
      .forEach((addedNode) => {
        this.importComponents(addedNode);
      });
  }

  async observeDomChanges(target: HTMLElement) {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        // handle only added and removed nodes
        if (mutation.type !== "childList") return;

        const addedNodes = Array.from(mutation.addedNodes);
        const removedNodes = Array.from(mutation.removedNodes);

        if (mutation.target && removedNodes.length) {
          this.afterNodeDeleted(removedNodes);
        }

        if (mutation.target && addedNodes.length) {
          this.afterNodeAdded(addedNodes as HTMLElement[]);
        }
      }
    });

    observer.observe(target, {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }

  findComponents(target: HTMLElement) {
    const finalTarget =
      target !== this.rootElement ? target.parentNode : this.rootElement;
    return Array.from(finalTarget.querySelectorAll(this.selector)).filter(
      (el) => !!el.dataset.r && !el.dataset.rId
    );
  }

  importComponents(target: HTMLElement) {
    return new Promise<void>((resolve, reject) => {
      try {
        const components = this.findComponents(target);
        components.forEach(async (component) => {
          const componentName = component.dataset.r;
          const rh = await import(
            `~/example/js/components/${componentName}.ts` // TODO from configs
          );

          const c = new ReactiveComponent(component, rh.default, this.events);
          COMPONENT_LIST.set(c.id, c);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async init() {
    try {
      await this.importComponents(this.rootElement);
      await this.observeDomChanges(this.rootElement);
    } catch (e) {
      console.error("RH-ERR", e);
    }
  }
}
