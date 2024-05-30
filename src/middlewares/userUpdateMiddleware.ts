import mongoose from 'mongoose';
import {
  NextFunction,
  Response,
} from 'express';
import { RequestCustom } from '../utils/requestCustom';
import HttpStatusCode from '../utils/constants';
import User from '../models/user';

const CustomError = require('../errors/errorHandlerCustom');

// Middleware для обновления данных пользователя
const updateUserMiddleware = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction,
  handleUpdate: boolean,
) => {
  // Извлечение данных из тела запроса
  const { name, about, avatar } = req.body;
  // Получение ID пользователя из объекта запроса
  const id = req.user?._id;
  try {
    // Обновление данных пользователя в зависимости от handleUpdate
    const user = await User.findByIdAndUpdate(id, handleUpdate === true ? {
      name,
      about,
    } : {
      avatar,
    }, {
      new: true, // Возвращает обновленный документ
      runValidators: true, // Запуск валидаторов для обновляемых полей
    });
    // Проверка наличия пользователя
    if (!user) {
      throw CustomError.NotFoundError('Пользователь не найден :(');
    }
    // Отправка успешного ответа с обновленными данными пользователя
    return res.status(HttpStatusCode.CREATED).json({ data: user });
  } catch (error) {
    // Обработка ошибки валидации данных
    if (error instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка при вводе данных!'));
    }
    // Передача остальных ошибок
    return next(error);
  }
};

export default updateUserMiddleware;