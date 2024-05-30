import mongoose from 'mongoose';
import express, {
  Application,
  json,
  Response,
  NextFunction,
} from 'express';
import { errors } from 'celebrate';
import logger from './utils/logHandler';
import errorHandler from './errors/errorHandler';
import { PORT, MONGODB_URL } from './config';
import router from './routes/index';
import { RequestCustom } from './utils/requestCustom';

// Инициализируем экземпляр приложения Express
const app: Application = express();

// Используем middleware для парсинга JSON в запросах
app.use(json());

// Мидлвар для установки пользователя в запросе
app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  // Установка объекта пользователя
  req.user = {
    _id: '66561b288707fa8b7bc5ebb0',
  };
  next();
});
// Подключаем маршрутизатор к корневому пути приложения
app.use('/', router);

// Обработка ошибок и логгирование
app.use(logger.logHandler);
app.use(errors());
app.use(errorHandler);

// Асинхронная функция для подключения к MongoDB и запуска сервера
const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB Подключен ✅');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB не подключен ❌', error);
  }
};

connect();