import mongoose from 'mongoose';
import {
  NextFunction,
  Response,
} from 'express';
import { RequestCustom } from '../utils/requestCustom';
import HttpStatusCode from '../utils/constants';
import Card from '../models/card';

const ErrorCustom = require('../utils/errorCustom');

// Middleware для обновления лайков на карточке
const updateLikeCardMiddleware = async (
  req: RequestCustom,
  res: Response,
  next: NextFunction,
  handleUpdate: boolean,
) => {
  // Извлечение ID карточки из параметров запроса
  const { cardId } = req.params;
  // Получение ID пользователя из объекта запроса
  const id = req.user?._id;
  try {
    if (!cardId) {
      throw ErrorCustom.BadRequest('Такой карточки еще нет :)');
    }
    // Обновление лайков на карточке в зависимости от handleUpdate
    const card = await Card.findByIdAndUpdate(cardId, handleUpdate === true ? {
      $addToSet: {
        likes: id,
      },
    } : {
      $pull: {
        likes: id,
      },
    }, {
      new: true,
      runValidators: true,
    });
    // Проверка наличия карточки
    if (!card) {
      throw ErrorCustom.NotFoundError('Карточка не найдена');
    }
    // Отправка успешного ответа с обновленными данными карточки
    return res.status(HttpStatusCode.CREATED).json({ data: card });
  } catch (error) {
    // Обработка ошибки неверного  ID
    if (error instanceof mongoose.Error.CastError) {
      return next(ErrorCustom.BadRequest('Не верный ID карточки'));
    }
    return next(error);
  }
};

export default updateLikeCardMiddleware;