import winston from 'winston';
import expressWinston from 'express-winston';

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

const logHandler = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
    }),
  ],
  format: winston.format.json(),
});

export default { requestLogger, logHandler };
