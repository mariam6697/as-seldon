import { NextFunction, Request, Response } from 'express';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import User from '../models/user.model';
import { UserService } from '../services/user.service';

export class UserController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: User = req.body;
      const required: string[] = ['email', 'password', 'role', 'surname', 'name'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(userData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const user: User = await UserService.create(userData);
      res.status(200).json({ status: 'ok', data: user });
    } catch (error: any) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const required: string[] = ['email', 'password'];
      const hasRequiredData: boolean = MiscUtils.checkRequired({ email, password }, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const response: any = await UserService.login(email, password);
      res.status(200).json({ status: 'ok', data: response });
    } catch (error: any) {
      next(error);
    }
  }
}
