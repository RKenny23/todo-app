import "./style.css";

const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");

const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");

const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-name]");
const newTaskDescription = document.querySelector(
  "[data-new-task-description]"
);
const newTaskDueDate = document.querySelector("[data-due-date-input]");
const newTaskPriority = document.getElementById("task-priority");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

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

// changes active list
listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

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

// clears completed tasks
clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

// deletes current list
deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

// adds new list
newListForm.addEventListener("submit", (e) => {
  e.preventDefault(); //stops form from submitting
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

// adds new task
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  const taskDescription = newTaskDescription.value;
  let taskDueDate = newTaskDueDate.value;
  const taskPriority = newTaskPriority.value;
  taskDueDate = convertDate(taskDueDate);
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName, taskDescription, taskDueDate, taskPriority);
  newTaskInput.value = null;
  newTaskDueDate.value = null;
  newTaskDescription.value = null;
  // newTaskPriority.value = "Low";
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

// Converts date format
function convertDate(date) {
  let myDate = new Date(date);

  if (isNaN(myDate.getFullYear())) return "";
  let month = myDate.getMonth();
  let day = myDate.getDate();
  let year = myDate.getFullYear();
  return `${month + 1}-${day + 1}-${year}`;
}

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name, description, dueDate, priority) {
  return {
    id: Date.now().toString(),
    name: name,
    description: description,
    dueDate: dueDate,
    priority: priority,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);

    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    const taskName = document.createElement("h3");
    const expandBtn = document.createElement("button");
    expandBtn.className = "expand-btn";
    const taskDescription = document.createElement("div");
    taskDescription.className = "content";
    const dateLabel = document.createElement("h3");
    const priorityLabel = document.createElement("h3");

    taskName.innerText = `${task.name}`;
    taskDescription.innerText = task.description;
    dateLabel.innerText = task.dueDate;
    priorityLabel.innerText = task.priority;

    label.append(taskName);
    label.append(expandBtn);
    label.append(taskDescription);
    label.append(dateLabel);
    label.append(priorityLabel);

    tasksContainer.appendChild(taskElement);
  });

  const expandBtn = document.getElementsByClassName("expand-btn");


  for (let i = 0; i < expandBtn.length; i++) {
    expandBtn[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
