import App from './app';
import allTodos from './all-todos';
import activeTodos from './active-todos';
import completedTodos from './completed-todos';

export default [
  {
    component: App,
    path: parentRoute => `${parentRoute}/`,
    routes: [
      {
        path: parentRoute => `${parentRoute}/`,
        exact: true,
        component: allTodos,
      },
      {
        path: parentRoute => `${parentRoute}/all`,
        component: allTodos,
      },
      {
        path: parentRoute => `${parentRoute}/active`,
        component: activeTodos,
      },
      {
        path: parentRoute => `${parentRoute}/completed`,
        component: completedTodos,
      },
    ],
  },
];
