import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import utils from './utils';
import enums from './enums';


export default function Footer(props) {
  const activeTodoWord = utils.pluralize(props.count, 'item');
  const { nowShowing } = props;
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{props.count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/all" className={classNames({ selected: nowShowing === enums.ALL_TODOS })}>
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/active"
            className={classNames({ selected: nowShowing === enums.ACTIVE_TODOS })}
          >
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to="/completed"
            className={classNames({ selected: nowShowing === enums.COMPLETED_TODOS })}
          >
              Completed
          </Link>
        </li>
      </ul>
      {
        props.completedCount ?
          <button className="clear-completed" onClick={props.onClearCompleted}>
            Clear completed
          </button>
          :
          null
      }
    </footer>
  );
}
