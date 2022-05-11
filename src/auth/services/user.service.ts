import { UserModel } from '../../infrastructure/database/schemas/user.schema';
import CustomError from '../../infrastructure/models/error.model';
import CryptUtils from '../../infrastructure/utils/crypt.utils';
import JwtUtils from '../../infrastructure/utils/jwt.utils';
import User from '../models/user.model';
import { MongoError } from 'mongodb';

export class UserService {
  public static async create(user: User): Promise<User> {
    try {
      user.password = await CryptUtils.hash(user.password);
      const newUser: User = await UserModel.create(user);
      return newUser;
    } catch (error: any) {
      if (error instanceof MongoError && error.code === 11000) {
        throw CustomError.DUP_DATA;
      }
      throw error;
    }
  }

  public static async login(email: string, password: string): Promise<any> {
    const user: User = await UserModel.findOne({ email: email }).select('+password').lean().exec();
    if (!user) {
      throw CustomError.USER_NOT_FOUND;
    }
    const isValid: boolean = await CryptUtils.validateHash(password, user.password);
    if (!isValid) {
      throw CustomError.AUTH_ERROR;
    }
    const accessToken: any = await JwtUtils.getAccessToken(user);
    return accessToken;
  }
}
