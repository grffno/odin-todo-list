import "./style.css";
import Todo from "./todo";
import Project from "./project";

class App {
  constructor() {
    this.projects = [];
    this.currentProject = null;
  }

  createNewTodo(title, description, dueDate, priority, project) {
    const todo = new Todo(title, description, dueDate, priority);
    project.addTodo(todo);
  }

  createNewProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.setCurrentProject(name);
  }

  getProject(name) {
    return this.projects.find((project) => project.name === name);
  }

  setCurrentProject(name) {
    this.currentProject = this.getProject(name);
  }

  getCurrentProject() {
    return this.currentProject;
  }
}

export default App;
