import App from "./app";
import { format, parse, parseISO } from "date-fns";

let appInstance = new App();

const priorityColors = {
  Low: "#ddffdd", // Light Green
  Medium: "#ffffdd", // Gold
  High: "#ffdddd", // Tomato Red
};

// HANDLE DOM ELEMENTS

// Utility function for generating DOM elements
function createElement(tag, props, ...children) {
  const element = document.createElement(tag);
  Object.assign(element, props);
  children.forEach((child) => {
    if (typeof child === "string") {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  });
  return element;
}

function renderPage() {
  const appContainer = createElement("div", { id: "app" });
  document.body.appendChild(appContainer);

  // Initialize Default Project
  if (appInstance.projects.length === 0) {
    appInstance.createNewProject("My First Project");
  }

  // Create sidebar
  const sidebarDiv = appContainer.appendChild(
    createElement("div", { id: "sidebar", className: "sidebar" })
  );
  const newProjectsModal = appContainer.appendChild(loadNewProjectsModal());
  const projectsDiv = sidebarDiv.appendChild(
    createElement("div", { id: "projects", className: "projects" })
  );

  loadProjects();

  // Create main area
  const mainDiv = appContainer.appendChild(
    createElement("div", {
      id: "main",
      className: "main",
    })
  );
  mainDiv.appendChild(loadTodoBtn());
  const todosDiv = mainDiv.appendChild(
    createElement("div", { id: "todos", className: "todos" })
  );
}

function loadProjects() {
  const projectsDiv = document.getElementById("projects");
  projectsDiv.innerHTML = "";
  const newProjectsBtn = projectsDiv.appendChild(loadNewProjectsBtn());

  appInstance.projects.forEach((project) => {
    const projectButtonDiv = createElement("div", {
      className: "project-btn-div",
    });
    const projectButton = createElement("button", {
      textContent: project.name,
      className: "project-btn",
    });
    const projectDeleteBtn = createElement("button", {
      textContent: "X",
      className: "project-delete-btn",
    });
    projectsDiv.appendChild(projectButtonDiv);
    projectButtonDiv.appendChild(projectButton);
    projectButtonDiv.appendChild(projectDeleteBtn);
    projectDeleteBtn.addEventListener("click", handleProjectDeleted);
    projectButton.addEventListener("click", handleProjectSelected);
  });

  return projectsDiv;
}

function loadInput(labelText, placeholder, labelId, type = "text") {
  const label = createElement("label", { textContent: labelText });
  const input = createElement("input", {
    type: type,
    placeholder: placeholder,
    id: labelId,
  });

  return createElement("div", {}, label, input);
}

function loadNewProjectsBtn() {
  // Create main modal button
  const btn = createElement("button", {
    textContent: "+ Add Project",
    id: "new-project-btn",
    className: "project-btn",
  });

  btn.addEventListener("click", handleNewProjectsBtn);

  return btn;
}

function loadNewProjectsModal() {
  // Create the modal structure
  const modal = createElement("div", {
    id: "new-project-modal",
    className: "modal",
  });

  // Modal content
  const modalContent = createElement("div", { className: "modal-content" });

  // New project input
  const input = loadInput("Project Name:", "Project Name", "new-project-name");
  input.className = "modal-label";
  modalContent.appendChild(input);

  // Modal OK button
  const modalOkBtn = createElement("button", {
    className: "modal-btn",
    innerHTML: "OK",
  });
  modalContent.appendChild(modalOkBtn);
  modalOkBtn.addEventListener("click", handleNewProjectsModalBtn);

  // Modal close button
  const modalCloseBtn = createElement("button", {
    className: "modal-btn",
    innerHTML: "Cancel",
  });
  modalContent.appendChild(modalCloseBtn);
  modalCloseBtn.addEventListener("click", handleNewProjectsModalCloseBtn);

  // Append modal content to modal
  modal.appendChild(modalContent);

  return modal;
}

function loadTodoBtn() {
  const newTodoBtn = createElement("button", {
    textContent: "+",
    className: "new-todo-btn",
  });
  newTodoBtn.addEventListener("click", handleAddTodo);
  return newTodoBtn;
}

function formatDate(dateString) {
  if (!dateString) return "mm/dd/yyyy";
  return format(parseISO(dateString), "MM/dd/yyyy");
}

function loadTodoForm() {
  const titleDiv = loadInput("", "Title", "todo-title");
  const notesDiv = loadInput("", "Notes", "todo-notes");
  const dueDateDiv = loadInput("", "Today's Date", "todo-due-date", "date");

  // Priority Dropdown
  const priorityDiv = createElement("div");
  const priorityLabel = createElement("label", { textContent: "Priority:" });
  const prioritySelect = createElement("select", { id: "todo-priority" });
  const priorities = ["Low", "Medium", "High"];
  priorities.forEach((level) => {
    const option = createElement("option", {
      value: level,
      textContent: level,
    });
    prioritySelect.appendChild(option);
  });
  priorityDiv.appendChild(priorityLabel);
  priorityDiv.appendChild(prioritySelect);

  const submitBtn = createElement("button", { textContent: "Submit" });
  submitBtn.addEventListener("click", handleNewTodo);

  return createElement(
    "form",
    { className: "todo-form", id: "todo-form" },
    titleDiv,
    notesDiv,
    dueDateDiv,
    priorityDiv,
    submitBtn
  );
}

function createTodoCard(todo) {
  let todoTitle = "";
  let todoNotes = "";
  let todoDueDate = "";
  let todoPriority = "";

  // Title
  todo.title !== ""
    ? (todoTitle = createElement("div", {
        textContent: todo.title,
      }))
    : (todoTitle = createElement("div", {
        textContent: "Title",
        className: "hidden",
      }));

  // Notes
  todo.notes !== ""
    ? (todoNotes = createElement("div", {
        textContent: todo.notes,
      }))
    : (todoNotes = createElement("div", {
        textContent: "Notes",
        className: "hidden",
      }));

  // Due Date
  todo.dueDate !== ""
    ? (todoDueDate = createElement("div", {
        textContent: formatDate(todo.dueDate),
      }))
    : (todoDueDate = createElement("div", {
        textContent: "Due Date",
        className: "hidden",
      }));

  // Priority
  const todoPriorityColor = priorityColors[todo.priority] || "#FFFFFF"; // Default to white if no priority set

  todo.priority !== ""
    ? (todoPriority = createElement("div", {
        textContent: todo.priority,
        style: `background-color: ${todoPriorityColor};`,
      }))
    : (todoPriority = createElement("div", {
        textContent: "Priority",
        className: "hidden",
      }));

  // Delete Button
  const todoDelete = createElement("button", {
    textContent: "X",
    className: "todo-delete-btn",
  });

  // Todo Details Container
  const todoDetailsContainer = createElement(
    "div",
    {
      className: "todo-details-container",
    },
    todoTitle,
    todoNotes,
    todoDueDate,
    todoPriority
  );

  // Todo Card Div
  const todoCardDiv = createElement(
    "div",
    {
      className: "todo-card",
      id: todo.id,
      style: `background-color: ${todoPriorityColor};`,
    },
    todoDetailsContainer,
    todoDelete
  );

  // Event Listeners
  todoDelete.addEventListener("click", handleDeleteTodo);
  todoCardDiv.addEventListener("click", handleTodoClick);
  todoTitle.addEventListener("click", handleTodoTitleClick);
  todoNotes.addEventListener("click", handleTodoNotesClick);
  todoDueDate.addEventListener("click", handleTodoDueDateClick);
  todoPriority.addEventListener("click", handleTodoPriorityClick);

  return todoCardDiv;
}

function loadTodos() {
  const todosDiv = document.getElementById("todos");
  todosDiv.innerHTML = "";

  const currentProject = appInstance.getCurrentProject();
  currentProject.todos.forEach((todo) => {
    console.log(todo);
    const todoCard = createTodoCard(todo);
    todosDiv.appendChild(todoCard);
  });
}

// EVENT HANDLERS
// TODO HANDLERS
function handleNewTodo(event) {
  event.preventDefault();

  const title = document.getElementById("todo-title").value;
  const notes = document.getElementById("todo-notes").value;
  const dueDate = document.getElementById("todo-due-date").value;
  const priority = document.getElementById("todo-priority").value;

  const currentProject = appInstance.getCurrentProject();

  appInstance.createNewTodo(title, notes, dueDate, priority, currentProject);
  loadTodos();

  // Clear inputs
  document.getElementById("todo-form").remove();

  updateLocalStorage();
}

function handleAddTodo() {
  const mainDiv = document.getElementById("main");
  const form = mainDiv.appendChild(loadTodoForm());
  document.getElementById("todo-title").focus();

  updateLocalStorage();
}

function handleTodoClick(event) {
  // Check if the click is on the todo card but not on a button or input
  if (
    event.target.className.includes("todo-card") &&
    !event.target.closest("button, input, select")
  ) {
    const todoDiv = event.target;
    const hiddenDivs = todoDiv.querySelectorAll("div.hidden");
    hiddenDivs.forEach((div) => {
      div.classList.remove("hidden");
      div.classList.add("show");
    });
  }
}

function handleDeleteTodo(event) {
  const todoCardDiv = event.target.closest(".todo-card");
  const todoId = parseInt(todoCardDiv.id);

  const currentProject = appInstance.getCurrentProject();
  currentProject.removeTodo(todoId);
  todoCardDiv.remove();

  updateLocalStorage();
}

function handleTodoTitleClick(event) {
  const todoId = parseInt(event.target.parentElement.parentElement.id);
  const todoTextContents = event.target.textContent;
  const input = createElement("input", {
    value: todoTextContents,
    type: "text",
    id: "todo-title-edit",
  });
  event.target.replaceWith(input);
  input.focus();
  input.select();

  // Handle losing focus, replace input with the updated title
  input.addEventListener("blur", function () {
    event.target.classList.remove("show");
    event.target.classList.add("full");
    const newTitle = input.value;
    event.target.textContent = newTitle;
    input.replaceWith(event.target);
    appInstance.updateTodoTitle(todoId, newTitle);
    document
      .querySelectorAll(".show")
      .forEach((item) => item.classList.add("hidden"));
  });

  updateLocalStorage();
}

function handleTodoNotesClick(event) {
  const todoId = parseInt(event.target.parentElement.parentElement.id);
  const todoTextContents = event.target.textContent;
  const input = createElement("input", {
    value: todoTextContents,
    type: "text",
    id: "todo-notes-edit",
  });
  event.target.replaceWith(input);
  input.focus();
  input.select();

  // Handle losing focus, replace input with the updated title
  input.addEventListener("blur", function () {
    event.target.classList.remove("show");
    event.target.classList.add("full");
    const newNotes = input.value;
    event.target.textContent = newNotes;
    input.replaceWith(event.target);
    appInstance.updateTodoNotes(todoId, newNotes);
    document
      .querySelectorAll(".show")
      .forEach((item) => item.classList.add("hidden"));
  });
}

function handleTodoDueDateClick(event) {
  const todoId = parseInt(event.target.parentElement.parentElement.id);
  const todoTextContents = event.target.textContent;

  const input = createElement("input", {
    value: todoTextContents,
    type: "date",
    id: "todo-due-date-edit",
  });
  event.target.replaceWith(input);
  input.focus();
  input.select();

  input.addEventListener("blur", function () {
    event.target.classList.remove("show");
    event.target.classList.add("full");
    // Format the date to mm/dd/yyyy for display
    const newDueDateDisplay = formatDate(input.value);

    event.target.textContent = newDueDateDisplay;
    input.replaceWith(event.target);

    appInstance.updateTodoDueDate(todoId, input.value);
    document
      .querySelectorAll(".show")
      .forEach((item) => item.classList.add("hidden"));
  });

  updateLocalStorage();
}

function handleTodoPriorityClick(event) {
  const todoId = parseInt(event.target.parentElement.parentElement.id);
  const currentPriority = event.target.textContent;
  const select = createElement("select", { id: "todo-priority-edit" });
  const priorities = ["Low", "Medium", "High"];

  // Create and append options to the select element
  priorities.forEach((level) => {
    const option = createElement("option", {
      value: level,
      textContent: level,
    });
    if (level === currentPriority) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  // Replace the current priority text with the select dropdown
  event.target.replaceWith(select);
  select.focus();

  // Event listener for when a new priority is selected
  select.addEventListener("change", function () {
    event.target.classList.remove("show");
    event.target.classList.add("full");
    const newPriority = select.value;
    event.target.textContent = newPriority;
    select.replaceWith(event.target);

    // Update the priority in the app data structure
    appInstance.updateTodoPriority(todoId, newPriority);

    // Update the background color of the priority div and the todo card
    const priorityDiv = event.target; // The div that shows the priority
    const todoCardDiv = event.target.closest(".todo-card");
    const newColor = priorityColors[newPriority] || "#FFFFFF";
    priorityDiv.style.backgroundColor = newColor;
    todoCardDiv.style.backgroundColor = newColor;
    document
      .querySelectorAll(".show")
      .forEach((item) => item.classList.add("hidden"));
  });

  updateLocalStorage();
}

// PROJECT HANDLERS
function handleNewProjectsBtn(event) {
  event.preventDefault();
  const modal = document.getElementById("new-project-modal");
  modal.style.display = "flex";
}

function handleProjectDeleted(event) {
  alert("Are you sure you want to delete this project and all its contents?");
  console.log(event.target.previousElementSibling.textContent);
  appInstance.removeProject(event.target.previousElementSibling.textContent);
  loadProjects();

  updateLocalStorage();
}

function handleNewProjectsModalCloseBtn(event) {
  event.preventDefault();
  const modal = document.getElementById("new-project-modal");
  modal.style.display = "none";
}

function handleNewProjectsModalBtn(event) {
  event.preventDefault();
  const modal = document.getElementById("new-project-modal");
  const newProjectName = document.getElementById("new-project-name").value;
  appInstance.createNewProject(newProjectName);
  modal.style.display = "none";

  loadProjects();

  updateLocalStorage();
}

function handleProjectSelected(event) {
  // Remove "project-btn-clicked" from all buttons
  const projectBtns = document.querySelectorAll(".project-btn");
  projectBtns.forEach((btn) => {
    btn.classList.remove("project-btn-clicked");
  });

  // Add "project-btn-clicked" to the clicked button
  event.target.classList.add("project-btn-clicked");

  // Set the current project
  appInstance.setCurrentProject(event.target.textContent);

  // Load todos for the current project
  loadTodos();
}

// LOCAL STORAGE

function serializeApp(appInstance) {
  return JSON.stringify(appInstance);
}

function deserializeApp(appData) {
  const parsedData = JSON.parse(appData);
  return new App(parsedData);
}

function updateLocalStorage() {
  localStorage.setItem("appData", serializeApp(appInstance));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem("appData");
  if (savedData) {
    appInstance = deserializeApp(savedData);
  } else {
    appInstance = new App();
  }
}

loadFromLocalStorage();

export default {
  renderPage,
};
