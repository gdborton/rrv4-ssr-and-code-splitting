import React from 'react';
import { renderRoutes } from 'react-router-config';
import TodoFooter from './footer';
import utils from './utils';
import fetch from 'cross-fetch';

const ENTER_KEY = 13;
const API_URL = process.env.API_URL || "http://localhost:3000/api";

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      newTodo: '',
      todos: [],
      loading: 0
    };
  }

  loading(inc) {
    this.setState({ loading: this.state.loading + inc })
  }

  deleteTodo(todo) {
    console.log("Deleting", todo);
    this.loading(1)
    return fetch(API_URL + "/todo/" + todo.id, { method: "DELETE" }).
      then(res => res.json()).then(response => {
        console.log("Got delete response: ", response);
        this.loading(-1)
      }).catch(err => { this.loading(-1); console.error("Failed deleting todo", err) })
  }

  addTodo(todo) {
    if (todo.id === undefined) {
      todo.id = utils.uuid();
    }
    console.log("Adding", todo);
    this.loading(1)
    return fetch(API_URL + "/todo", { method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
      }).
      then(res => res.json()).then(response => {
        console.log("Got add response: ", response);
        this.loading(-1)
      }).catch(err => { this.loading(-1); console.error("Failed adding todo", err) })
  }

  updateTodo(todo) {
    console.log("Updating", todo);
    this.loading(1)
    return fetch(API_URL + "/todo/" + todo.id, 
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(todo) 
      }).
      then(res => res.json()).then(response => {
        console.log("Got update response: ", response);
        this.loading(-1)
      }).catch(err => { this.loading(-1); console.error("Failed updating todo", err) })
  }

  loadTodo() {
    console.log("Fetching all todos");
    this.loading(1)
    return fetch(API_URL + "/todo").then(res => res.json()).then(todos => {
      console.log("Got all todos", todos);
      this.setState({ todos });
      this.loading(-1)
    }).catch(err => { this.loading(-1); console.error("Failed fetching todos", err) })
  }

  componentDidMount() {
    this.loadTodo()
  }

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      this.addTodo({
        id: utils.uuid(),
        title: val,
        completed: false
      }).then(() => {
        this.loadTodo().then(() => {
          this.setState({ newTodo: '' })
        })
      });
    }
  }

  toggleAll(event) {
    const { checked } = event.target;
    Promise.all(this.state.todos.map(todo => 
      this.updateTodo(Object.assign({}, todo, { completed: checked })))).then(() => {
      this.loadTodo();
    })
  }

  toggle(todo) {
    this.updateTodo(Object.assign({}, todo, { completed: !todo.completed })).then(() => {
      this.loadTodo();
    })
  }

  destroy(todo) {
    this.deleteTodo(todo).then(() => {
      this.loadTodo();
    })
  }

  edit(todo) {
    this.setState({ editing: todo.id });
  }

  save(todo, text) {
    this.updateTodo(Object.assign({}, todo, { title: text })).then(() => {
      this.loadTodo().then(() => {
        this.setState({ editing: null })
      })
    })
  }

  cancel() {
    this.setState({ editing: null });
  }

  clearCompleted() {
    const todel = this.state.todos.filter(todo => todo.completed);
    const del = todel.map(todo => this.deleteTodo(todo))
    Promise.all(del).then(() => {
      this.loadTodo();
    })
  }

  render() {
    let footer;
    let main;
    const { todos } = this.state;

    const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);

    const completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        (<TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.props.location.pathname}
          onClearCompleted={() => { this.clearCompleted(); }}
        />);
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            {
              renderRoutes(this.props.route.routes, {
                todos,
                onToggle: (todo) => { this.toggle(todo); },
                onDestroy: (todo) => { this.destroy(todo); },
                onEdit: (todo) => { this.edit(todo); },
                editing: todo => this.state.editing === todo.id,
                onSave: (todo, text) => { this.save(todo, text); },
                onCancel: () => this.cancel(),
              })
            }
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>
            todos
            { this.state.loading > 0 ? <div className="spinner"></div> : <span/> }
          </h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={(event) => { this.handleNewTodoKeyDown(event); }}
            onChange={(event) => { this.handleChange(event); }}
            autoFocus
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

export default TodoApp;
