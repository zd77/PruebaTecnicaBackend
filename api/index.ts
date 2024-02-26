import { Application } from 'express';

import { createRouter } from './v1/example/router';
import { BinaryTreeFromJSON } from '../structs/BinaryTreeFromJSON';


function routerApi(app: Application, dataTree: BinaryTreeFromJSON) {
  const router = createRouter( dataTree );
  app.use(
    '/api',
    router,
  );
}

export default routerApi;
