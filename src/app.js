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

  createNewTodo(title, notes, dueDate, priority, project) {
    const id = this.getNewId();
    const todo = new Todo(id, title, notes, dueDate, priority);
    project.addTodo(todo);
  }

  getTodoById(todoId) {
    for (const project of this.projects) {
      const todo = project.todos.find((todo) => todo.id === todoId);
      if (todo) {
        return todo;
      }
    }
    return null; // Return null if todo is not found
  }

  updateTodoTitle(todoId, newTitle) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.title = newTitle;
    }
  }

  updateTodoNotes(todoId, newNotes) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.notes = newNotes;
    }
  }

  updateTodoDueDate(todoId, newDueDate) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.dueDate = newDueDate;
    }
  }

  updateTodoPriority(todoId, newPriority) {
    const todo = this.getTodoById(todoId);
    if (todo) {
      todo.priority = newPriority;
    }
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
