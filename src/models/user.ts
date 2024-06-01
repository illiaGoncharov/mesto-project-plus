import {
  model,
  Model,
  Document,
  Schema,
} from 'mongoose';
import bcrypt from 'bcrypt';
import validation from '../validation/validators';
import { defaultUser } from '../config';

const CustomError = require('../errors/errorHandlerCustom');

// Определяем интерфейс IUser, который расширяет Document от Mongoose
interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

// Интерфейс IUserDocument расширяет IUser и Document от Mongoose
interface IUserDocument extends Document<IUser>{}

// Интерфейс UserModel расширяет Model от Mongoose + add статический метод findUserByCredentials
interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<IUserDocument>
}

// Создаём схему для модели User с типизацией IUser
const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    default: defaultUser.NAME,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: defaultUser.ABOUT,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: defaultUser.AVATAR,
    validate: validation.linkValidationUser,
  },
  email: {
    type: String,
    required: [true, 'e-mail is required'],
    unique: true,
    validate: validation.emailValidationUser,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    select: false,
  },
});

// Статический метод для поиска пользователя по email и паролю
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password') // Включаем поле password в результат запроса
    .then((user) => {
      if (!user) {
        // Если пользователь не найден
        throw CustomError.Unauthorized('Неверно введен логин или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((userValid: boolean) => {
          if (!userValid) {
            // Если пароль неверный
            throw CustomError.Unauthorized('Неверно введен логин или пароль');
          }
          return user; // Возвращаем найденного пользователя
        });
    });
});

// Экспортируем с указанием типизации IUser и UserModel
export default model<IUser, UserModel>('user', userSchema);