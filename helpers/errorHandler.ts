import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError, ApiResponse } from './statusCodes';
import { errorLog } from './loggers';

import env from './env';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    const response = new ApiError({
      statusCode: 400,
      message: 'Body invalido',
      title: "Bad Request",
      success: false,
      data: err.format(),
    });

    return res.status(response.statusCode).json(response.getResponse());
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.getResponse());
  }

  // manage 500 errors

  errorLog.error(err);

  if (env.NODE_ENV === 'production') {
    const response = new ApiError({
      statusCode: 500,
      title: "Error de Servidor",
      message: `Ha ocurrido un error en el endpoint ${req.method} ${req.url}`,
    });
    return res.status(response.statusCode).json(response.getResponse());
  }

  console.log(err);

  const response = new ApiError({
    statusCode: 500,
    title: "Error de Servidor",
    message: err.message,
  });

  res.status(response.statusCode).json(response.getResponse());
};
