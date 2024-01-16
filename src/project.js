import Todo from "./todo";

class Project {
  constructor(name, todos = []) {
    this.name = name;
    this.todos = todos.map(
      (todo) =>
        new Todo(todo.id, todo.title, todo.notes, todo.dueDate, todo.priority)
    );
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
  }

  getTodos() {
    return this.todos;
  }
}

export default Project;
