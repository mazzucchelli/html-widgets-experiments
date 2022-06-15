import shortid from "shortid";
import { ObservableMembrane } from "observable-membrane";
import { ProxyPropertyKey } from "observable-membrane/dist/shared";
// import { parseDataset } from "../utils";
import Configs from "../configs";
import { convertType } from "../utils";
import { ListenerSignature } from "tiny-typed-emitter";

export type RC<Props, Children> = ReactiveComponent<Props, Children>;

const snakeToCamel = (str: string) =>
  str.replace(/([-_][a-z0-9])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );

export class ReactiveComponent<Props, Children> {
  private $htmlEl: HTMLElement;
  private propsMap: { [key: string]: string };

  public destroy: () => void;
  public id: string;
  public props: Props;
  public children: Children;

  constructor(htmlEl: HTMLElement, handler: any, emitter: unknown) {
    this.id = shortid.generate();
    this.$htmlEl = htmlEl;
    this.propsMap = {};
    this.props = {} as Props;
    this.children = {} as Children;

    htmlEl.setAttribute("data-r-id", this.id);

    this.collectChildren();
    this.collectProps();

    const destroyFun = handler(this, emitter);
    this.destroy = destroyFun ? destroyFun : () => {};
  }

  get $el() {
    return this.$htmlEl;
  }

  private collectChildren() {
    const c = Array.from(
      this.$htmlEl.querySelectorAll(`[r-child]`) as NodeListOf<HTMLElement>
    );

    c.forEach((el) => {
      const name = el.getAttribute("r-child");
      this.children[name] = el;
    });
  }

  useChild = (name: string) =>
    this.$htmlEl.querySelector(`[${Configs.target}="${name}"]`) as HTMLElement;

  useChildren = (name: string) =>
    Array.from(
      this.$htmlEl.querySelectorAll(
        `[${Configs.target}="${name}"]`
      ) as NodeListOf<HTMLElement>
    );

  useState = <T extends object>(proxy: T, onChange: () => void): T => {
    const membrane = new ObservableMembrane({
      valueObserved(target: any, key: ProxyPropertyKey) {
        // where target is the object that was accessed
        // and key is the key that was read
        // console.log("accessed ", key, target);
      },
      valueMutated(target: any, key: ProxyPropertyKey) {
        // where target is the object that was mutated
        // and key is the key that was mutated
        // console.log("mutated ", key, target);
        onChange();
      },
    });

    return membrane.getProxy(proxy);
  };

  collectProps = () => {
    // temp props object
    const obj = {} as any;

    // cycle dataset and only handle interesting attributes
    for (const [key, value] of Object.entries(this.$htmlEl.dataset)) {
      if (key.startsWith("r") && key !== "r" && !key.startsWith("rId")) {
        // adjust prop name: r-prop-name -> propName
        const [firstLetter, ...restOfWord] = key.substring(1);
        const cleanKey = snakeToCamel(firstLetter.toLowerCase() + restOfWord);

        // save original attibute name
        this.propsMap[cleanKey] = key;

        // store the converted value in temp props object
        obj[cleanKey] = convertType(value);
      }
    }

    // make props object reactive so it can auto update the DOM
    this.props = this.useState(obj, () => {
      for (const [key, value] of Object.entries(this.props)) {
        const datasetKey = this.propsMap[key];
        this.$htmlEl.dataset[datasetKey] = JSON.stringify(value);
      }
    });
  };
}
