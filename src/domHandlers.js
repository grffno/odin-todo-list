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

  // Load divs
  appContainer.appendChild(loadTodoForm());
  appContainer.appendChild(loadNewProjectsForm());
  appContainer.appendChild(
    createElement("div", { id: "projectsDiv", className: "projects" })
  );
  appContainer.appendChild(createElement("div", { id: "todosDiv" }));

  loadProjects();
}

function loadProjects() {
  const projectsDiv = document.getElementById("projectsDiv");
  projectsDiv.innerHTML = "";

  appInstance.projects.forEach((project) => {
    const projectButton = createElement("button", {
      textContent: project.name,
    });
    projectsDiv.appendChild(projectButton);
    projectButton.addEventListener("click", handleProjectSelected);
  });

  return projectsDiv;
}

function loadInput(labelText, placeholder, labelId) {
  const label = createElement("label", { textContent: labelText });
  const input = createElement("input", {
    type: "text",
    placeholder: placeholder,
    id: labelId,
  });
  return createElement("div", {}, label, input);
}

function loadNewProjectsForm() {
  const newProjectDiv = loadInput(null, "New Project Name", "new-project-name");
  newProjectDiv.required = true;

  const newProjectBtn = createElement("button", {
    textContent: "Add New Project",
  });
  newProjectBtn.addEventListener("click", handleNewProject);

  return createElement(
    "form",
    { className: "newProjectForm" },
    newProjectDiv,
    newProjectBtn
  );
}

function loadTodoForm() {
  const titleDiv = loadInput("Title:", "Buy Groceries", "todo-title");
  const descriptionDiv = loadInput(
    "Description:",
    "Apples, Oranges, Bananas...",
    "todo-description"
  );
  const dueDateDiv = loadInput("Date Due:", "MM/DD/YYYY", "todo-due-date");
  const priorityDiv = loadInput("Priority:", "High", "todo-priority");

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
  const todoCardDiv = createElement(
    "div",
    { className: "todo" },
    todoTitle,
    todoDescription,
    todoDueDate,
    todoPriority
  );

  return todoCardDiv;
}

function loadTodos() {
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
  document.getElementById("todo-title").value = "";
  document.getElementById("todo-description").value = "";
  document.getElementById("todo-due-date").value = "";
  document.getElementById("todo-priority").value = "";
}

function handleNewProject(event) {
  event.preventDefault();
  const name = document.getElementById("new-project-name").value;
  if (name && !appInstance.getProject(name)) {
    appInstance.createNewProject(name);
    loadProjects();
  }

  // Clear input
  document.getElementById("new-project-name").value = "";
}

function handleProjectSelected(event) {
  appInstance.setCurrentProject(event.target.textContent);
  loadTodos();
}

export default {
  renderPage,
};
