import {
  Router,
  NextFunction,
  Request,
  Response,
} from 'express';
import userRouter from './users';
import cardRouter from './cards';
import Errors from '../errors/errors';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

// Мидлвар для обработки ошибки 404
router.use((req: Request, res: Response, next: NextFunction) => {
  next(Errors.notFoundError('404'));
});

export default router;