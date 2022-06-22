import { WidgetFunction } from "../../types";

interface Props {
  name: string;
  age?: number;
}

const Observable: WidgetFunction<Props> = (
  { $el, props, propEffect },
  plugins
) => {
  const [name, setName] = propEffect("name", () => {
    console.log("watch trigger", name);
  });

  setName("asdads");
};

export default Observable;
