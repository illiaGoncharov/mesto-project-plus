import mongoose from 'mongoose';
import express, {
  Application,
  json,
} from 'express';
import { errors } from 'celebrate';
import logger from './utils/logHandler';
import errorHandler from './errors/errorHandler';
import { PORT, server, db } from './config';
import router from './routes/index';
import userControllers from './controllers/users';
import authenticationMiddleware from './middlewares/authenticationMiddleware';
import userValidation from './validation/userValidation';

// Инициализируем экземпляр приложения Express
const app: Application = express();

// Используем middleware для парсинга JSON в запросах
app.use(json());

// Подключаем логгер
app.use(logger.requestLogger);

// Маршрут для входа
app.use('/signin', userValidation.loginUserValidation, userControllers.loginUser);
// Маршрут для регистрации
app.use('/signup', userValidation.createUserValidation, userControllers.createUser);
// Миддлвэр для аутентификации пользователя
app.use(authenticationMiddleware);

// Подключаем маршрутизатор к корневому пути приложения
app.use('/', router);

// Обработка ошибок и логгирование
app.use(logger.logHandler);
app.use(errors());
app.use(errorHandler);

// Асинхронная функция для подключения к MongoDB и запуска сервера
const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(`mongodb://${server}/${db}`);
    console.log('MongoDB Подключен ✅');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB не подключен ❌', error);
  }
};

connect();