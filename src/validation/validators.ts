import validator from 'validator';
import { urlRegExp } from '../config';

// Интерфейс для опций валидации
export interface IValidationOptions {
  // Функция валидации
  // eslint-disable-next-line no-unused-vars
  validator: (arg: string) => boolean;
  message: string; // Сообщение об ошибке, если валидация не прошла
}

// Опции валидации для проверки ссылки на аватар
const linkValidationUser: IValidationOptions = {
  validator: (link: string) => urlRegExp.test(link),
  message: 'Ссылка не прошла валидацию!',
};

// Опции валидации для проверки email
const emailValidationUser: IValidationOptions = {
  // isEmail из библиотеки validator
  validator: (val: string) => validator.isEmail(val),
  message: 'Email не прошел валидацию!',
};

export default {
  linkValidationUser,
  emailValidationUser,
};
