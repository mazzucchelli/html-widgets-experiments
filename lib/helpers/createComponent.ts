interface createRHDataModel {
  name?: string;
  template?: string;
  tag?: string;
  props?: { [x: string]: string };
}

export default ({ name, template, tag, props }: createRHDataModel) => {
  const rootTag = document.createElement(tag || "div");

  if (name) rootTag.dataset.r = name;

  if (template) {
    rootTag.innerHTML = template;
  }

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      rootTag.dataset[key] = value;
    }
  }

  return rootTag;
};
