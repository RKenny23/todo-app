const LOCAL_STORAGE_LIST_KEY = "task.lists";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

const createList = (name) => {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

const createTask = (name, description, dueDate, priority) => {
  return {
    id: Date.now().toString(),
    name: name,
    description: description,
    dueDate: dueDate,
    priority: priority,
    complete: false,
  };
}

function convertDate(date) {
  let myDate = new Date(date);

  if (isNaN(myDate.getFullYear())) return "";
  let month = myDate.getMonth();
  let day = myDate.getDate();
  let year = myDate.getFullYear();
  return `${month + 1}-${day + 1}-${year}`;
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

export {createList, createTask, convertDate, save};