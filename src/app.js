import "./style.css";
import Todo from "./todo";
import Project from "./project";

class App {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.currentId = 0;
  }

  getNewId() {
    this.currentId += 1;
    return this.currentId;
  }

  createNewTodo(title, description, dueDate, priority, project) {
    const id = this.getNewId();
    const todo = new Todo(id, title, description, dueDate, priority);
    project.addTodo(todo);
  }

  createNewProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.setCurrentProject(name);
  }

  removeProject(name) {
    const indexToRemove = this.projects.findIndex((obj) => obj.name === name);
    this.projects.splice(indexToRemove, 1);
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
