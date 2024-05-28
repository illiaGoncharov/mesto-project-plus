import express, { Application, json } from 'express';
import mongoose from 'mongoose';

// Получаем значение порта из переменной окружения / используем 3000 по умолчанию
const { PORT = 3000 } = process.env;

// Инициализируем экземпляр приложения Express
const app: Application = express();

// Используем middleware для парсинга JSON в запросах
app.use(json());

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