import {
  model,
  Document,
  Schema,
} from 'mongoose';

// Определяем интерфейс IUser, который расширяет Document от Mongoose
interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

// Создаём схему для модели User с типизацией IUser
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default model('user', userSchema);