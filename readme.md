Simplify DOM manipulation with **`ReactiveHtml`** components

> Note: this is currently just an experiment

## Quick overview

```html
<div data-r="ReactiveComponent"></div>
```

```javascript
// components/ReactiveComponent.js

export default (ctx) => {
  ctx.$el.innerHTML = "Hello World!";

  return () => {
    console.log(`Something just removed ${ctx.$el} from the DOM`);
  };
};
```

## Setup

```html
<div data-r-root>
  <!-- your components here -->
</div>
```

```javascript
import ReactiveHtml from "reactive-html";
import ReactiveComponent from "./components/ReactiveComponent";

new ReactiveHtml({
  components: { ReactiveComponent },
});
```

## How `props` works

Every attribute **in the root element** starting with `r-` is considered a _prop_.

- NodeChilds can also have a `r-child` attribute to be more easily consumed and typed

```html
<div
  data-r="ReactiveComponent"
  r-num="1"
  r-str="foo"
  r-arr="[1,2,3]"
  r-obj="{ 'foo': 'bar' }"
>
  <button r-child="btn">Click me</button>
</div>
```

```javascript
export default (ctx) => {
  const { num, str, arr, obj } = ctx.props; // values of all props found, already converted
  const { btn } = ctx.children; // all [r-child] tag found as HTMLelement

  console.log(typeof num); // number
  console.log(typeof str); // string
  console.log(typeof arr); // array
  console.log(typeof obj); // object

  btn.addEventListener("click", () => {
    num += 1; // this action will automatically update [r-count] value
  });
};
```

## How `state` works

It's possible to define an observable value using the `setObservable` method, that accepts 2 arguments:

- the value to observe, _typeof object_ only
- the callback to run everytime the value changes

```html
<div data-r="ReactiveComponent">
  <span r-child="count"></span>
  <button r-child="btn">Click me</button>
</div>
```

```javascript
export default ({ $el, children, setObservable }) => {
  const { count, btn } = children;

  const foo$ = setObservable({ value: 1 }, () => {
    count.innerText = someState.value;
  });

  btn.addEventListener("click", () => {
    foo$.value += 1; // this action will automatically update content of span[r-child="count"]
  });
};
```

## `Typescript` friendly

```html
<div data-r="ReactiveComponent" r-step="1" r-max="10">
  <span r-child="count"></span>
  <button r-child="btn">Click me</button>
</div>
```

```typescript
import { RH } from "reactive-html";

interface Props {
  step: number;
  max: number;
}

interface Children {
  count: HTMLSpanElement;
  btn: HTMLButtonElement;
}

export default (ctx: RC<CounterProps, CounterChildren>) => {
  // ...
  const count_$ = useState<{ value: number }>({ value: 0 }, () => {
    value.innerText = `${count_$.value}`;
  });
  // ...
};
```
