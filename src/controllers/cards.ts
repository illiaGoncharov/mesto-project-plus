import mongoose from 'mongoose';
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import HttpStatusCodes from '../utils/constants';
import { RequestCustom } from '../utils/requestCustom';
import Card from '../models/card';
import cardLikeUpdateMiddleware from '../middlewares/cardLikeUpdateMiddleware';

const ErrorCustom = require('../errors/errorHandlerCustom');

// Получение всех карточек
const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Попытка получить все карточки
    const cards = await Card.find({}).populate(['owner', 'likes']);
    // Отправка успешного ответа с данными
    return res.send({ data: cards });
  } catch (error) {
    return next(error);
  }
};

// Создание новой карточки по ID
const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    // Извлечение данных новой карточки из тела запроса
    const { name, link } = req.body;
    const owner = req.user?._id;
    // Создание новой карточки
    const card = await Card.create({ name, link, owner });
    return res.status(HttpStatusCodes.CREATED).json({ data: card });
  } catch (error) {
    // Обработка ошибок валидации Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      return next(ErrorCustom.BadRequest('Ошибка при создании карточки!'));
    }
    return next(error);
  }
};

//  Удаление карточки по ID
const removeCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    // Поиск карточки по ID и удаление
    const cardToDelete = await Card.findById(cardId).orFail();
    if (cardToDelete.owner.toString() !== req.user?._id) {
      throw ErrorCustom.Unauthorized(
        'У вас нет таких полномочий.',
      );
    }
    // Удаление карточки
    const deleteCard = await cardToDelete.deleteOne();
    return res.status(HttpStatusCodes.NO_CONTENT).json({ data: deleteCard });
  } catch (error) {
    // Обработка ошибок Mongoose
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(ErrorCustom.BadRequest('Карточка другого пользователя.'));
    }
    if (error instanceof mongoose.Error.CastError) {
      return next(ErrorCustom.BadRequest('Карточка не найдена :('));
    }
    return next(error);
  }
};

// Добавление лайка
const addLike = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handlePutLike = true;
  cardLikeUpdateMiddleware(req, res, next, handlePutLike);
};

// Удаление лайка
const removeLike = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handlePutLike = false;
  cardLikeUpdateMiddleware(req, res, next, handlePutLike);
};

export default {
  getCards,
  createCard,
  removeCard,
  addLike,
  removeLike,
};