import { NextFunction, Response } from 'express';
import User from '../models/user';
import { RequestCustom } from './requestCustom';

// Импортируем модуль с кастомными ошибками
const ErrorCustom = require('../errors/errorHandlerCustom');

// eslint-disable-next-line no-unused-vars
const userSearch = async (req: RequestCustom, res: Response, next: NextFunction, auth: boolean) => {
  const id = auth === true ? req.user?._id : req.params;
  const user = await User.findById(id);
  if (!user) {
    throw ErrorCustom.NotFoundError('Ошибка при получении пользователя');
  }
  return res.json({ data: user });
};

export default userSearch;