import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
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
  public static async create(@Body() user: User): Promise<User> {
    try {
      const userData: User = await UserService.create(user);
      return userData;
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
  public static async update(@Path() userId: string, @Body() user: User): Promise<User> {
    try {
      const response: User = await UserService.update(userId, user);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a certain user given its ID
   */
  @Delete('/{userId}')
  public static async delete(@Path() userId: string): Promise<void> {
    try {
      await UserService.delete(userId);
    } catch (error: any) {
      throw error;
    }
  }
}
