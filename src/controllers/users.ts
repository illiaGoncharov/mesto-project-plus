import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Errors from '../errors/errors';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Попытка получить всех пользователей
    const users = await User.find({});
    // Отправка успешного ответа с данными
    res.status(200).json({ data: users });
  } catch (error) {
    // Логирование ошибки на сервере для отладки
    console.error('Ошибка при получении пользователей:', error);
    next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

export default getUsers;