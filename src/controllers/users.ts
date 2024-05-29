import mongoose from 'mongoose';
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { RequestCustom } from '../utils/requestCustom';
import User from '../models/user';
import userSearch from '../utils/userSearch';
import HttpStatusCodes from '../utils/constants';
import userUpdateMiddleware from '../middlewares/userUpdateMiddleware';

// Импортируем модуль с кастомными ошибками
const ErrorCustom = require('../utils/errorCustom');

// Получить всех пользователей
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Попытка получить всех пользователей
    const users = await User.find({});
    // Отправка успешного ответа с данными
    return res.json({ data: users });
  } catch (error) {
    return next(error);
  }
};

// Получить пользователя по ID
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = false;
    return userSearch(req, res, next, auth);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(ErrorCustom.BadRequest('Ошибка при получении пользователя!'));
    }
    return next(error);
  }
};

// Получить информацию о пользователе по ID
const getUserInfoById = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const auth = true;
    return userSearch(req, res, next, auth);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(ErrorCustom.BadRequest('Ошибка при получении пользователя!'));
    }
    return next(error);
  }
};

// Создать нового пользователя
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Извлечение данных нового пользователя из тела запроса
    const { name, about, avatar } = req.body;
    // Создание нового пользователя
    const user = await User.create({ name, about, avatar });
    return res.status(HttpStatusCodes.CREATED).json({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(ErrorCustom.BadRequest('Ошибка в вводе данных пользователя!'));
    }
    return next(error);
  }
};

// Обновить данные пользователя
const updateUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handleUpdateUser = true;
  userUpdateMiddleware(req, res, next, handleUpdateUser);
};

// Обновить аватар пользователя
const updateUserAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const handleUpdateUser = false;
  userUpdateMiddleware(req, res, next, handleUpdateUser);
};

export default {
  getUsers,
  getUserById,
  getUserInfoById,
  createUser,
  updateUser,
  updateUserAvatar,
};