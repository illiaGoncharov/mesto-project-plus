import {
  Request,
  Response,
  NextFunction,
} from 'express';
import Card from '../models/card';
import Errors from '../errors/errors';
import { RequestCustom } from '../type';

// Получение всех карточек
const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  Попытка получить всех карточки
    const cards = await Card.find({});
    // Отправка успешного ответа с данными
    return res.status(200).send({ data: cards });
  } catch (error) {
    // Логирование ошибки на сервере для отладки
    console.error('Ошибка при получении карточек:', error);
    // Передача в следующий middleware объекта ошибки
    return next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

// Создание новой карточки по ID
const createCard = async (req: RequestCustom, res: Response, next: NextFunction) => {
  // Извлечение данных новой карточки из тела запроса
  const { name, link } = req.body;
  const owner = req.user?._id;
  // Проверка наличия всех необходимых данных
  if (!name || !link || !owner) {
    return next(Errors.badRequestError('Некорректные или неполные данные'));
  }
  try {
    // Создание новой карточки
    const card = await Card.create({ name, link, owner });
    return res.status(201).json({ data: card });
  } catch (error) {
    console.error('Ошибка при создании карточки:', error);
    return next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

//  Удаление карточки по ID
const removeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return next(Errors.authorizationError('У вас нет таких полномочий'));
    }
    return res.status(204).json({ data: card });
  } catch (error) {
    console.error('Ошибка при удалении карточки:', error);
    return next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

export default { getCards, createCard, removeCard };