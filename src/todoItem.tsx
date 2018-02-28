import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

interface IOwnProps {
  editing: any;
  todo: any;
  onCancel: Function;
  onDestroy: Function;
  onEdit: Function;
  onSave: Function;
  onToggle: Function;
}

interface IProps extends IOwnProps { // , DispatchProp<any>, RouteComponentProps<any>
  // location: history.Location;
}

interface IState {
  editText: string;
}

export default class TodoItem extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      editText: props.todo.title,
    };

    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  componentDidUpdate(prevProps: IProps) {
    if (!prevProps.editing && this.props.editing) {
      const node = ReactDOM.findDOMNode(this.refs.editField) as HTMLInputElement;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  handleDestroy(event:  React.MouseEvent<HTMLInputElement>) {
    console.log(event);
    this.props.onDestroy();
  }

  handleToggle(event:  React.ChangeEvent<HTMLInputElement>) {
    console.log(event);
    this.props.onToggle();
  }

  handleSubmit() {
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    } else {
      this.props.onDestroy();
    }
  }

  handleEdit() {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  }

  handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.editing) {
      this.setState({ editText: event.target.value });
    }
  }

  render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing,
      })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.handleToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.handleDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}
