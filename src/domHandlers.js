import App from "./app";

let appInstance = new App();

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
  appInstance.createNewProject("My First Project");
  console.log("current project:", appInstance.getCurrentProject());

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
  modalOkBtn.addEventListener("click", handleNewProjectsModalOkBtn);

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

function loadTodoForm() {
  const titleDiv = loadInput("", "Title", "todo-title");
  const descriptionDiv = loadInput("", "Notes", "todo-description");
  const dueDateDiv = loadInput("", "Today's Date", "todo-due-date", "date");
  const priorityDiv = loadInput("", "Priority", "todo-priority", "number");

  const submitBtn = createElement("button", { textContent: "Submit" });
  submitBtn.addEventListener("click", handleNewTodo);

  return createElement(
    "form",
    { className: "todo-form", id: "todo-form" },
    titleDiv,
    descriptionDiv,
    dueDateDiv,
    priorityDiv,
    submitBtn
  );
}

function createTodoCard(todo) {
  const todoTitle = createElement("h3", { textContent: todo.title });
  const todoDescription = createElement("p", { textContent: todo.description });
  const todoDueDate = createElement("p", { textContent: todo.dueDate });
  const todoPriority = createElement("p", { textContent: todo.priority });
  const todoDelete = createElement("button", { textContent: "Delete" });
  const todoCardDiv = createElement(
    "div",
    { className: "todo-card", id: todo.id },
    todoTitle,
    todoDescription,
    todoDueDate,
    todoPriority,
    todoDelete
  );

  todoDelete.addEventListener("click", handleDeleteTodo);

  return todoCardDiv;
}

function loadTodos() {
  const todosDiv = document.getElementById("todos");
  todosDiv.innerHTML = "";

  const currentProject = appInstance.getCurrentProject();
  currentProject.todos.forEach((todo) => {
    const todoCard = createTodoCard(todo);
    todosDiv.appendChild(todoCard);
  });
}

// EVENT HANDLERS
function handleNewTodo(event) {
  event.preventDefault();

  const title = document.getElementById("todo-title").value;
  const description = document.getElementById("todo-description").value;
  const dueDate = document.getElementById("todo-due-date").value;
  const priority = document.getElementById("todo-priority").value;

  const currentProject = appInstance.getCurrentProject();

  appInstance.createNewTodo(
    title,
    description,
    dueDate,
    priority,
    currentProject
  );
  loadTodos();

  // Clear inputs
  document.getElementById("todo-form").remove();
}

function handleAddTodo(event) {
  const mainDiv = document.getElementById("main");
  mainDiv.appendChild(loadTodoForm());
  document.getElementById("todo-title").focus();
}

function handleDeleteTodo(event) {
  const todoCardDiv = event.target.closest(".todo-card");
  const todoId = parseInt(todoCardDiv.id);

  const currentProject = appInstance.getCurrentProject();
  currentProject.removeTodo(todoId);
  todoCardDiv.remove();
}

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
}

function handleNewProjectsModalCloseBtn(event) {
  event.preventDefault();
  const modal = document.getElementById("new-project-modal");
  modal.style.display = "none";
}

function handleNewProjectsModalOkBtn(event) {
  event.preventDefault();
  const modal = document.getElementById("new-project-modal");
  const newProjectName = document.getElementById("new-project-name").value;
  appInstance.createNewProject(newProjectName);
  modal.style.display = "none";

  loadProjects();
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

export default {
  renderPage,
};
