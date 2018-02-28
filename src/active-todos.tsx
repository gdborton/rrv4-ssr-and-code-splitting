import * as React from 'react';
import TodoList from './todoList';

interface IOwnProps {
  editing: Function;
  // placeholder
  todos: any[];
  onCancel: Function;
  onDestroy: Function;
  onEdit: Function;
  onSave: Function;
  onToggle: Function;
}

interface IProps extends IOwnProps { // , DispatchProp<any>, RouteComponentProps<any>
  // location: history.Location;
}

export default function ActiveTodos({ todos, ...props }: IProps) {
  const filteredTodos: any[] = todos.filter(todo => !todo.completed);
  return <TodoList todos={filteredTodos} {...props} />;
}
