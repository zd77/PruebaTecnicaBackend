import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


import { ApiError, errorLog } from '../helpers';

import routerApi from '../api/index';

import { createServer } from 'http';
import { errorHandler } from '../helpers/errorHandler';
import { initDataTreeFromJSON } from '../structs/BinaryTreeFromJSON';

const morgan = require('morgan');



try {
  //connectMongoDB();

  //For env File
  dotenv.config();

  const app: Application = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // Puerto de la app
  const dataTree = initDataTreeFromJSON();
  const port = process.env.PORT || 3000;
  routerApi(app, dataTree);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
