import winston from 'winston';
import expressWinston from 'express-winston';

// Конфигурация логирования запросов
const requestLogger = expressWinston.logger({
  transports: [
    // Логи запросов будут сохраняться в файл 'request.log'
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

// Конфигурация логирования ошибок
const logHandler = expressWinston.errorLogger({
  transports: [
    // Логи запросов будут сохраняться в файл 'error.log'
    new winston.transports.File({
      filename: 'error.log', // Имя файла
    }),
  ],
  format: winston.format.json(),
});

export default { requestLogger, logHandler };
