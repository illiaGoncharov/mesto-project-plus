import mongoose from 'mongoose';
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import HttpStatusCodes from '../utils/constants';
import { RequestCustom } from '../utils/requestCustom';
import User from '../models/user';
import userSearch from '../utils/userSearch';
import userUpdateMiddleware from '../middlewares/userUpdateMiddleware';

// Импортируем модуль с кастомными ошибками
const ErrorCustom = require('../errors/errorHandlerCustom');

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
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    // Хэширование пароля перед сохранением в БД
    const hashPassword = await bcrypt.hash(password, 11);

    // Создание нового пользователя
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });

    return res.status(HttpStatusCodes.CREATED).json({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return next(ErrorCustom.Conflict('На этот email есть зарегестрированный аккаунт!'));
    }
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

// Вход пользователя
const loginUser = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      // Если пользователь найден, создаем JWT токен
      token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getUsers,
  getUserById,
  getUserInfoById,
  createUser,
  updateUser,
  updateUserAvatar,
  loginUser,
};