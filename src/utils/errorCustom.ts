// eslint-disable-next-line import/no-import-module-exports
import HttpStatusCodes from './constants';

// Определяем интерфейс IError + свойство statusCode
export interface IError extends Error {
  statusCode?: number;
}

class CustomError extends Error implements IError {
  public statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
    // this.name = this.constructor.name;
  }

  // Метод для 400
  static BadRequest(message: string) {
    return new CustomError(HttpStatusCodes.BAD_REQUEST, message);
  }

  // Метод для 401
  static Unauthorized(message: string) {
    return new CustomError(HttpStatusCodes.UNAUTHORIZED, message);
  }

  // Метод для 404
  static NotFoundError(message: string) {
    return new CustomError(HttpStatusCodes.NOT_FOUND, message);
  }

  // Метод для 409
  static Conflict(message: string) {
    return new CustomError(HttpStatusCodes.CONFLICT, message);
  }
}

export default CustomError;
