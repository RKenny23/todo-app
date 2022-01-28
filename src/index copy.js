import "./style.css";
import "./modules/EventListeners";
import { createList, createTask, save } from "./modules/logic";
import { renderLists, renderTasks, renderTaskCount } from "./modules/render";

const LOCAL_STORAGE_LIST_KEY = "task.lists";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];


if (localStorage.getItem(LOCAL_STORAGE_LIST_KEY) == null) {
  createList("Example Project");
  createTask("A Simple To-Do App", "2020-12-31");
  createTask("Lacks a lot of quality of life features right now", "2020-12-31");
  createTask("But stay posted, there is more to come :)", "2020-12-31");
  renderTasks();
} else {
  save();
  renderLists();
  renderTasks();
  renderTaskCount();
}

export { lists };
// function saveAndRender() {
//   save();
//   render();
// }
