import {
  celebrate,
  Segments,
  Joi,
} from 'celebrate';
import { urlRegExp } from '../config';

// Валидация получения по ID
const getCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().length(24).hex().required,
  }),
});

// Валидация создания
const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegExp).required(),
  }),
});

export default { createCardValidation, getCardValidation };