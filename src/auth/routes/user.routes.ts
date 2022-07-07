import { Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import User from '../models/user.model';
import CustomError from '../../infrastructure/models/error.model';

const router: Router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const response: any = await UserController.login({ email, password });
    res.status(200).json({ status: 'ok', data: response });
  } catch (error: any) {
    next(error);
  }
});

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const user: User = await UserController.create(userData);
      res.status(200).json({ status: 'ok', data: user });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/:userId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'readOwn'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUserId: string = res.locals.loggedInUser._id;
      const loggedInUserRole: string = res.locals.loggedInUser.role;
      const userId: string = req.params.userId;
      if (userId != loggedInUserId && loggedInUserRole != 'admin') {
        throw CustomError.AUTH_ERROR;
      }
      const user: User = await UserController.get(userId);
      res.status(200).json({ status: 'ok', data: user });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'readAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const search: string = req.query.search ? (req.query.search as string) : null;
      const result: any = await UserController.getAll(page, limit, search);
      res.status(200).json({ status: 'ok', data: result });
    } catch (error: any) {
      next(error);
    }
  }
);

router.put(
  '/:userId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'updateOwn'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUserId: string = res.locals.loggedInUser._id;
      const loggedInUserRole: string = res.locals.loggedInUser.role;
      const userId: string = req.params.userId;
      const userData: User = req.body;
      if (userId != loggedInUserId && loggedInUserRole != 'admin') {
        throw CustomError.AUTH_ERROR;
      }
      const user: User = await UserController.update(userId, userData);
      res.status(200).json({ status: 'ok', data: user });
    } catch (error: any) {
      next(error);
    }
  }
);

router.delete(
  '/:userId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'deleteAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUserId: string = res.locals.loggedInUser._id;
      const userId: string = req.params.userId;
      if (userId == loggedInUserId) {
        throw CustomError.ROLE_ERROR;
      }
      await UserController.delete(userId);
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
