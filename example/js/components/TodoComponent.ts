import { RC } from "../../../lib/helpers/ReactiveComponent";
// import createComponent from "../../../lib/helpers/createComponent";

// interface Children {
//   todoInput: HTMLInputElement;
//   todoList: HTMLDivElement;
//   doneList: HTMLDivElement;
// }

export default ({ $el, useState }: RC<{}>) => {
  // const { todoInput, todoList, doneList } = children;

  // const prependToTodoList = (element: HTMLElement) => {
  //   todoList.prepend(element);
  // };

  // const moveToDoneList = (element: HTMLElement) => {
  //   const cloned = element;
  //   doneList.prepend(cloned);
  //   // element.remove();
  // };

  // todoInput.addEventListener("keydown", function (e) {
  //   if (e.keyCode == 13 && e.metaKey) {
  //     const newTodo = createComponent({
  //       template: `
  //         <span>${todoInput.value}</span>
  //         <button>close</button>
  //       `,
  //     });

  //     newTodo.querySelector("button").addEventListener("click", (e) => {
  //       moveToDoneList(newTodo);
  //     });

  //     todoList.prepend(newTodo);
  //     todoInput.value = "";
  //   }
  // });
};
