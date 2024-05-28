import { Request } from 'express';

// Расширение интерфейса Request из Express для добавления поля user с _id
export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}