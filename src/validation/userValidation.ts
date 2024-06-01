import {
  celebrate,
  Joi,
  Segments,
} from 'celebrate';
import { urlRegExp } from '../config';

// Валидация получения по ID
const getUserByIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    // user ID = строка длиной 24 символа в шестнадцатеричном формате + обязательный
    userId: Joi.string().length(24).hex().required(),
  }),
});

// Валидация создания
const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// Валидация обновления данных пользователя
const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

// Валидация тела запроса для обновления аватар
const updateUserAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().pattern(urlRegExp).required(),
  }),
});

// Валидация тела запроса для входа
const loginUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export default {
  getUserByIdValidation,
  createUserValidation,
  updateUserValidation,
  updateUserAvatarValidation,
  loginUserValidation,
};