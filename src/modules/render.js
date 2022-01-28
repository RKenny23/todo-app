import {lists} from "../index copy";
import {createListBtnListeners, createTaskBtnListeners} from "./EventListeners";
import {createList, createTask} from "./logic";

const listsContainer = document.querySelector("[data-lists]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const tasksContainer = document.querySelector("[data-tasks]");
const listCountElement = document.querySelector("[data-list-count]");
const taskTemplate = document.getElementById("task-template");

const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);



function renderLists() {

  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
  }
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
  createListBtnListeners();
}

function renderTasks(selectedList) {
  clearElement(listsContainer);
  
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
  createTaskBtnListeners();
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}


function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export {renderLists, renderTasks, renderTaskCount};