import {
  Request,
  Response,
  NextFunction,
} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

const CustomError = require('../errors/errorHandlerCustom');

// Интерфейс для расширения типов Express.Request с пользовательским полем user
interface IAuthReq extends Request {
  user?: string | JwtPayload
}

// Middleware для аутентификации пользователя
// eslint-disable-next-line consistent-return
const authenticationMiddleware = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    // Проверяем наличие заголовка Authorization и формат токена
    const { authorization } = req.body;
    if (!authorization || !authorization.startWith('Bearer ')) {
      return next(CustomError.Unauthorized('Необходима авторизация'));
    }
    // Извлекаем токен из заголовка
    const token = authorization.replace('Bearer ', '');
    // Верифицируем токен и извлекаем payload
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // Сохраняем payload токена в объекте запроса для последующих обработчиков маршрутов
    req.user = payload;
    // Передаем управление следующему обработчику
    next();
  } catch (error) {
    // Если происходит ошибка при верификации токена, передаем ее в обработчик ошибок
    next(new CustomError.Unauthorized('Необходима авторизация'));
  }
};

export default authenticationMiddleware;