import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import User from '../models/user.model';
import { UserService } from '../services/user.service';

@Tags('Auth')
@Route(`auth/users`)
export class UserController {
  /**
   * Allows to retrieve an auth token for a certain user
   */
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

  /**
   * Creates a new user in the database
   */
  @Post('/')
  public static async create(@Body() data: { user: User }): Promise<User> {
    try {
      const required: string[] = ['email', 'password', 'role', 'surname', 'name'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(data.user, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const user: User = await UserService.create(data.user);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Retrieves a user data given its ID
   */
  @Get('/{userId}')
  public static async get(@Path() userId: string): Promise<any> {
    try {
      const response: any = await UserService.get(userId);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated users list
   */
  @Get('/')
  public static async getAll(
    @Query() page: number,
    @Query() limit: number,
    @Query() search?: string
  ): Promise<any> {
    try {
      const result: any = await UserService.getAll(page, limit, search);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Allows to update a user record
   */
  @Put('/{userId}')
  public static async update(@Path() userId: string, @Body() data: { user: User }): Promise<User> {
    try {
      const response: any = await UserService.update(userId, data.user);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a certain user given its ID
   */
  @Delete('/{userId}')
  public static async delete(@Path() userId: string): Promise<any> {
    try {
      await UserService.delete(userId);
    } catch (error: any) {
      throw error;
    }
  }
}
