import dotenv from 'dotenv';

// Загружаем переменные окружения из файла .env
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mestodb';
// const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

export { PORT, MONGODB_URL };