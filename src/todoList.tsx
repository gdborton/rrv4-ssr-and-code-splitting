import * as React from 'react';
import TodoItem from './todoItem';

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

export default function TodoList(props: IProps) {
  const todoItems = props.todos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => { props.onToggle(todo); }}
      onDestroy={() => { props.onDestroy(todo); }}
      onEdit={() => { props.onEdit(todo); }}
      editing={props.editing(todo)}
      onSave={(text) => { props.onSave(todo, text); }}
      onCancel={() => { props.onCancel(); }}
    />
  ));

  return (
    <div>
      {todoItems}
    </div>
  );
}
