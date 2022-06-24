import { Body, Post, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import User from '../models/user.model';
import { UserService } from '../services/user.service';

@Tags('Users')
@Route(`auth/users`)
export class UserController {
  @Post('/')
  public static async create(@Body() userData: User): Promise<User> {
    try {
      const required: string[] = ['email', 'password', 'role', 'surname', 'name'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(userData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const user: User = await UserService.create(userData);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  @Post('/login')
  public static async login(@Body() data: { email: string; password: string }): Promise<any> {
    try {
      const email: string = data.email;
      const password: string = data.password;
      const required: string[] = ['email', 'password'];
      const hasRequiredData: boolean = MiscUtils.checkRequired({ email, password }, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const response: any = await UserService.login(email, password);
      return response;
    } catch (error: any) {
      throw error;
    }
  }
}
