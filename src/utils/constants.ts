// Константа для серверных ошибок
const INTERNAL_SERVER_ERROR: number = 500;

// Константы для клиентских ошибок
const BAD_REQUEST: number = 400;
const UNAUTHORIZED: number = 401;
const NOT_FOUND: number = 404;
const CONFLICT: number = 409;

// Константы для успешных ответов
const CREATED: number = 201;
const NO_CONTENT: number = 204;

export default {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  CREATED,
  NO_CONTENT,
};
