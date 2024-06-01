import crypto from 'crypto';

// Подключаем dotenv для загрузки переменных среды из файла .env
require('dotenv').config();

// Адрес и порт сервера MongoDB
const server: string = '127.0.0.1:27017';
// Название БД MongoDB
const db: string = 'mestodb';
// Порт, на котором запускается приложение + по умолчанию 3000
const { PORT = 3000 } = process.env;

// Генерируем случайный секретный ключ для JWT, если он не задан в .env
const secretKey = crypto.randomBytes(32).toString('hex');
const JWT_SECRET = process.env.TOKEN_ENV as string || secretKey;

// Данные о пользователе по умолчанию
const defaultUser = {
  NAME: 'Жак-Ив Кусто',
  ABOUT: 'Исследователь',
  AVATAR: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

// Регулярное выражение для проверки URL
const urlRegExp: RegExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

// Экспортируемые
export {
  server,
  db,
  PORT,
  JWT_SECRET,
  defaultUser,
  urlRegExp,
};