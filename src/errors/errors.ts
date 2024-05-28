interface IError {
  status: number;
  message: string;
}

// Функция создания объекта ошибки
const serverError = (status: number, message: string): IError => ({
  status,
  message,
});

// Определение типовых ошибок
const badRequestError = (message: string): IError => serverError(400, message);
const authorizationError = (message: string): IError => serverError(401, message);
const notFoundError = (message: string): IError => serverError(404, message);
const internalError = (message: string): IError => serverError(500, message);

export default {
  badRequestError,
  authorizationError,
  notFoundError,
  internalError,
};
