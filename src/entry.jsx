import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { hydrate } from 'react-dom';
import React from 'react';
import { renderRoutes } from 'react-router-config';

import routes from './routes';

import { convertCustomRouteConfig, ensureReady } from './rrv4Helpers';

const routeConfig = convertCustomRouteConfig(routes);

if (typeof window !== 'undefined') {
  ensureReady(routeConfig).then(() => {
    const props = JSON.parse(document.getElementById('props').dataset.props); // eslint-disable-line
    hydrate(
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
