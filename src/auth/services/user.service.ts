import { UserModel } from '../../infrastructure/database/schemas/user.schema';
import CustomError from '../../infrastructure/models/error.model';
import CryptUtils from '../../infrastructure/utils/crypt.utils';
import JwtUtils from '../../infrastructure/utils/jwt.utils';
import User from '../models/user.model';
import { MongoError } from 'mongodb';

export class UserService {
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

  public static async get(userId: string): Promise<User> {
    try {
      const user: User = await UserModel.findById(userId).lean();
      if (!user) {
        throw CustomError.USER_NOT_FOUND;
      }
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  public static async getAll(page: number, limit: number, search: string): Promise<any> {
    const offset: number = (page - 1) * limit;
    let query: any = {};
    if (search) {
      const searchRegexp: any = { $regex: search, $options: 'i' };
      query['$and'].push({
        $or: [
          { email: searchRegexp },
          { name: searchRegexp },
          { surname: searchRegexp },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ['$name', ' ', '$surname'] },
                regex: search,
                options: 'i'
              }
            }
          }
        ]
      });
    }
    const result: any = await UserModel.find(query).skip(offset).limit(limit);
    const users: User[] = result;
    const totalItems: number = await UserModel.countDocuments(query);
    return { totalItems, limit, page, users };
  }

  public static async update(userId: string, newData: User): Promise<User> {
    try {
      const user: User = await UserModel.findById(userId).lean();
      if (!user) {
        throw CustomError.USER_NOT_FOUND;
      }
      const updatedUser: User = await UserModel.findByIdAndUpdate(userId, newData, {
        useFindAndModify: false
      }).lean();
      return updatedUser;
    } catch (error: any) {
      throw error;
    }
  }

  public static async delete(userId: string): Promise<void> {
    try {
      const user: User = await UserModel.findById(userId).lean();
      if (!user) {
        throw CustomError.USER_NOT_FOUND;
      }
      await UserModel.findByIdAndDelete(userId);
    } catch (error: any) {
      throw error;
    }
  }
}
