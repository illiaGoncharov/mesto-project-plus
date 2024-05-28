import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
// Подключение модуля для обработки ошибок
import Errors from '../errors/errors';

// Получить всех пользователей
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Попытка получить всех пользователей
    const users = await User.find({});
    // Отправка успешного ответа с данными
    return res.status(200).json({ data: users });
  } catch (error) {
    // Логирование ошибки на сервере для отладки
    console.error('Ошибка при получении пользователей:', error);
    // Передача в следующий middleware объекта ошибки
    return next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

// Получить пользователя по ID
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  // Извлечение ID пользователя из параметров запроса
  const { id } = req.params;
  try {
    // Поиск пользователя по ID
    const user = await User.findById(id);
    if (!user) {
      return next(Errors.authorizationError('Ошибка при получении пользователя'));
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

// Создать нового пользователя
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Извлечение данных нового пользователя из тела запроса
  const { name, about, avatar } = req.body;
  // Проверка наличия всех необходимых данных
  if (!name || !about || !avatar) {
    return next(Errors.badRequestError('Некорректные или неполные данные'));
  }
  try {
    // Создание нового пользователя
    const user = await User.create({ name, about, avatar });
    return res.status(201).json({ data: user });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return next(Errors.internalError('Произошла неожиданная ошибка!'));
  }
};

export default { getUsers, getUserById, createUser };