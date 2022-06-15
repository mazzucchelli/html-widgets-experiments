import { ReactiveComponent } from "./ReactiveComponent";
import { ListenerSignature } from "tiny-typed-emitter";

export class ReactiveHtml {
  private components: any;
  private events: ListenerSignature<unknown>;
  private importer: () => Promise<any> | null;
  private rootElement: any;
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
    console.log("afterNodeDeleted", removedNodes);
  }

  afterNodeAdded(addedNodes: HTMLElement[]) {
    addedNodes
      .filter((el) => !!el.querySelectorAll)
      .forEach((addedNode) => {
        this.importComponents(addedNode);
      });
  }

  async observeDomChanges(target: HTMLElement) {
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          const removedNodes = Array.from(mutation.removedNodes);

          if (mutation.target && removedNodes.length) {
            this.afterNodeDeleted(removedNodes);
          }

          if (mutation.target && addedNodes.length) {
            this.afterNodeAdded(addedNodes as HTMLElement[]);
          }
        } else {
          return;
          //   if (
          //     mutation.attributeName.includes("data-state") &&
          //     !!mutation.target.CID
          //   ) {
          //     this.afterStateAttributeChanged(
          //       mutation.target.CID,
          //       mutation.attributeName
          //     );
          //   }
        }
      }
    });

    observer.observe(target, config);
  }

  findComponents(target: HTMLElement) {
    const finalTarget =
      target !== document.body ? target.parentNode : document.body;
    return Array.from(finalTarget.querySelectorAll(this.selector)).filter(
      (el) => !!el.dataset.r && !el.dataset.rId
    );
  }

  importComponents(target: HTMLElement) {
    return new Promise<void>((resolve, reject) => {
      try {
        const components = this.findComponents(target);
        components.forEach((component) => {
          const componentName = component.dataset.r;
          new ReactiveComponent(
            component,
            this.components[componentName],
            this.events
          );
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async init() {
    try {
      const res = await this.importComponents(this.rootElement);
      await this.observeDomChanges(this.rootElement);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }
}
