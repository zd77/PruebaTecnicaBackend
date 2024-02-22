import { Application } from 'express';

import example from './v1/example/router';


function routerApi(app: Application) {
  app.use(
    '/api',
    example,
  );
}

export default routerApi;
