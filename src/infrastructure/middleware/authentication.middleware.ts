import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../auth/models/user.model';
import CustomError from '../models/error.model';

const roleAccess = {
  admin: {
    user: ['createAny', 'readAny', 'updateAny', 'deleteAny'],
    project: ['createAny', 'readAny', 'updateAny', 'deleteAny']
  },
  maintainer: {
    user: ['readOwn', 'updateOwn']
  }
};

export class AuthenticationMiddleware {
  public static async accessControl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let accessToken: string = req.headers['authorization'];
      if (accessToken) {
        if (!accessToken.startsWith('Bearer ')) {
          return next(CustomError.TOKEN_ERROR);
        }
        accessToken = accessToken.slice(7, accessToken.length);
        try {
          const tokenData: any = jwt.verify(accessToken, process.env.JWT_SECRET);
          res.locals.loggedInUser = {
            _id: tokenData.userId,
            role: tokenData.role
          };
          next();
        } catch (error: any) {
          next(CustomError.TOKEN_ERROR);
        }
      } else {
        next();
      }
    } catch (error: any) {
      next(error);
    }
  }

  public static async allowIfLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: User = res.locals.loggedInUser;
      if (user) {
        next();
      } else {
        next(CustomError.AUTH_ERROR);
      }
    } catch (error: any) {
      next(error);
    }
  }

  public static grantAccess = (
    resource: string,
    action: string
  ): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const access: boolean = roleAccess[res.locals.loggedInUser.role]?.[resource]?.some(
        (element: string) => element === action
      );
      if (access) {
        next();
      } else {
        next(CustomError.ROLE_ERROR);
      }
    };
  };
}
