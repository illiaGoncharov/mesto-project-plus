import express, {
  Application,
  json,
  Response,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { RequestCustom } from './type';

// Получаем значение порта из переменной окружения / используем 3000 по умолчанию
const { PORT = 3000 } = process.env;
// Инициализируем экземпляр приложения Express
const app: Application = express();
// Используем middleware для парсинга JSON в запросах
app.use(json());
// Подключаем маршрутизатор к корневому пути приложения
app.use('/', router);
// Мидлвар для установки пользователя в запросе
app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  // Установка объекта пользователя
  req.user = {
    _id: '66561b288707fa8b7bc5ebb0',
  };
  next();
});

// Асинхронная функция для подключения к MongoDB и запуска сервера
const connect = async () => {
  try {
    // Подключаемся к локальной базе данных MongoDB
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    // Сообщение об успешном подключении
    console.log('✓');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

connect();