import React from 'react';
import { renderRoutes } from 'react-router-config';
import TodoFooter from './footer';
import utils from './utils';

const ENTER_KEY = 13;

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      newTodo: '',
      todos: props.todos,
    };
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
      this.setState({
        todos: this.state.todos.concat({
          id: utils.uuid(),
          title: val,
          completed: false,
        }),
        newTodo: '',
      });
    }
  }

  toggleAll(event) {
    const { checked } = event.target;
    this.setState({
      todos: this.state.todos.map(todo => Object.assign({}, todo, { completed: checked })),
    });
  }

  toggle(todoToToggle) {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo === todoToToggle) {
          return Object.assign({}, todo, {
            completed: !todo.completed,
          });
        }
        return todo;
      }),
    });
  }

  destroy(passedTodo) {
    this.setState({
      todos: this.state.todos.filter(todo => todo !== passedTodo),
    });
  }

  edit(todo) {
    this.setState({ editing: todo.id });
  }

  save(todoToSave, text) {
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo === todoToSave) {
          return Object.assign({}, todo, {
            title: text,
          });
        }
        return todo;
      }),
      editing: null,
    });
  }

  cancel() {
    this.setState({ editing: null });
  }

  clearCompleted() {
    this.setState({
      todos: this.state.todos.filter(todo => !todo.completed),
    });
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
          <h1>todos</h1>
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
