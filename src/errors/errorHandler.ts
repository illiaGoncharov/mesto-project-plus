import { NextFunction, Request, Response } from 'express';
import { IError } from './errorHandlerCustom';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  console.error(err);
  res.status(statusCode).json({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;