import { RouteConfig } from 'react-router-config';

import { TodoApp } from './app';
import { generateAsyncRouteComponent } from './rrv4Helpers';

export type ParentRoutePath = (parentRoute: string) => string;

// @ts-ignore
export interface CustomRouteConfig extends RouteConfig {
  path: string | ParentRoutePath;
  routes?: CustomRouteConfig[];
}

// export function isCustomRouteConfig(routeConfig: CustomRouteConfig | RouteConfig): routeConfig is CustomRouteConfig {
//   return (<CustomRouteConfig>routeConfig).path is ParentRoutePath;
// }

export const AppRoutes: CustomRouteConfig[] = [
  {
    component:TodoApp,
    path: (parentRoute) => `${parentRoute}/`,
    routes: [
      {
        path: parentRoute => `${parentRoute}/`,
        exact: true,
        component: generateAsyncRouteComponent({
          loader: () => import('./all-todos'),
        }),
      },
      {
        path: parentRoute => `${parentRoute}/all`,
        component: generateAsyncRouteComponent({
          loader: () => import('./all-todos'),
        }),
      },
      {
        path: parentRoute => `${parentRoute}/active`,
        component: generateAsyncRouteComponent({
          loader: () => import('./active-todos'),
        }),
      },
      {
        path: parentRoute => `${parentRoute}/completed`,
        component: generateAsyncRouteComponent({
          loader: () => import('./completed-todos'),
        }),
      },
    ],
  },
];
