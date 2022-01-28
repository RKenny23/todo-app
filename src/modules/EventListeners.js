import { convertDate, save } from "./logic";

const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

function createListBtnListeners() {
  const newListForm = document.querySelector("[data-new-list-form]");
  const newListInput = document.querySelector("[data-new-list-input]");
  // adds new list
  newListForm.addEventListener("submit", (e) => {
    e.preventDefault(); //stops form from submitting
    const listName = newListInput.value;
    if (listName == null || listName === "") return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    save();
  });

  const listsContainer = document.querySelector("[data-lists]");
  // changes active list
  listsContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
      selectedListId = e.target.dataset.listId;
      save();
    }
  });

  const deleteListButton = document.querySelector("[data-delete-list-button]");
  // deletes current list
  deleteListButton.addEventListener("click", (e) => {
    lists = lists.filter((list) => list.id !== selectedListId);
    selectedListId = null;
    save();
  });

  const listTitleElement = document.querySelector("[data-list-title]");
  // edits list title
  listTitleElement.ondblclick = function (e) {
    let text = this.innerHTML;
    let input = document.createElement("input");
    input.classList = "title-change";
    input.value = text;
    input.onblur = function () {
      let val = this.value;
      this.parentNode.innerHTML = val;
    };
    this.innerHTML = "";
    this.appendChild(input);
    input.focus();
  };
}

function createTaskBtnListeners() {
  const newTaskForm = document.querySelector("[data-new-task-form]");
  const newTaskInput = document.querySelector("[data-new-task-name]");
  const newTaskDescription = document.querySelector(
    "[data-new-task-description]"
  );
  const newTaskDueDate = document.querySelector("[data-due-date-input]");
  const newTaskPriority = document.getElementById("task-priority");
  // adds new task
  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    const taskDescription = newTaskDescription.value;
    let taskDueDate = newTaskDueDate.value;
    const taskPriority = newTaskPriority.value;
    taskDueDate = convertDate(taskDueDate);
    if (taskName == null || taskName === "") return;
    const task = createTask(
      taskName,
      taskDescription,
      taskDueDate,
      taskPriority
    );
    newTaskInput.value = null;
    newTaskDueDate.value = null;
    newTaskDescription.value = null;
    // newTaskPriority.value = "Low";
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks.push(task);
    save();
  });

  const tasksContainer = document.querySelector("[data-tasks]");
  // changes tasks remaining
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "input") {
      const selectedList = lists.find((list) => list.id === selectedListId);
      const selectedTask = selectedList.tasks.find(
        (task) => task.id === e.target.id
      );
      selectedTask.complete = e.target.checked;
      save();
      renderTaskCount(selectedList);
    }
  });

  const clearCompleteTasksButton = document.querySelector(
    "[data-clear-complete-tasks-button]"
  );
  // clears completed tasks
  clearCompleteTasksButton.addEventListener("click", (e) => {
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    save();
  });
}

export {createListBtnListeners, createTaskBtnListeners};
