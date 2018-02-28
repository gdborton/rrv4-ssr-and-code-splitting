import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { render } from 'react-dom';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';

import { AppRoutes } from './routes';

import { convertCustomRouteConfig, ensureReady } from './rrv4Helpers';

const routeConfig = convertCustomRouteConfig(AppRoutes);

if (typeof window !== 'undefined') {
  ensureReady(routeConfig).then(() => {
    const e = document.getElementById('props');
    const d = e ? e.dataset.props : undefined;
    const c = d ? d : '';
    const props = JSON.parse(c); // eslint-disable-line
    render(
      (
        <BrowserRouter>
          { renderRoutes(routeConfig, props) }
        </BrowserRouter>
      ),
      document.getElementsByClassName('todoapp')[0], // eslint-disable-line
    );
  });
}

export default function render2(location, props) {
  return ensureReady(routeConfig, location).then(() => (
    <StaticRouter context={{}} location={location}>
      {renderRoutes(routeConfig, props)}
    </StaticRouter>
  ));
}
