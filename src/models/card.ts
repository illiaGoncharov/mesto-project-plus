import {
  model,
  Document,
  Schema,
  Types,
} from 'mongoose';
import user from './user';

// Определяем интерфейс ICard
interface ICard extends Document {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId; // ID пользователя, создавшего карточку
  likes: Array<Types.ObjectId>; // Массив ID пользователей, которые лайкнули карточку
  createdAt: Date;
}

// Создаём схему для модели Card
const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId, // Поле owner типа ObjectId (ссылка на пользователя)
    required: true,
    ref: user,
  },
  likes: {
    type: [Types.ObjectId], // Поле likes - массив ObjectId
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
