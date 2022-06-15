import { ReactiveComponent } from "./ReactiveComponent";
import { ListenerSignature } from "tiny-typed-emitter";

const RH_MEMORY = new Map();

export class ReactiveHtml {
  private components: {
    [key: string]: ReactiveComponent<unknown, unknown>;
  };
  private asyncComponents: {
    [key: string]: string;
  };
  private rootElement: HTMLElement;
  private selector: any;

  constructor({
    components,
    asyncComponents,
    rootElement = `[data-r-root]`,
    selector = `[data-r]`,
  }) {
    this.rootElement = document.body.querySelector(rootElement);
    this.selector = selector;
    this.components = components;
    this.asyncComponents = asyncComponents;

    this.init();
  }

  get COMPONENT_LIST() {
    return Object.keys(this.components);
  }

  get ASYNC_COMPONENT_LIST() {
    return Object.keys(this.asyncComponents);
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

        if (RH_MEMORY.has(rId)) {
          const instance = RH_MEMORY.get(rId);
          instance.destroy();
          RH_MEMORY.delete(rId);
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

          // if component is typeof string is considered a path to lazy import
          const shouldImport =
            this.ASYNC_COMPONENT_LIST.includes(componentName);

          if (shouldImport) {
            // import or get component handler
            const asyncRh = await import(
              `~/${this.asyncComponents[componentName]}`
            );

            // init component
            const instance = new ReactiveComponent(component, asyncRh.default);

            // store component reference
            RH_MEMORY.set(instance.id, instance);
          } else {
            // import or get component handler
            const rh = this.components[componentName];

            // init component
            const instance = new ReactiveComponent(component, rh);

            // store component reference
            RH_MEMORY.set(instance.id, instance);
          }
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
