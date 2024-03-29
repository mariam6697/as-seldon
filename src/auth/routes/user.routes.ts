import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { UserController } from '../controllers/user.controller';
import User from '../models/user.model';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Parser from '../../infrastructure/utils/parser.utils';

const router: Router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginFields: string[] = ['email', 'password'];
    MiscUtils.hasRequiredData(req.body, loginFields);
    const email: string = req.body.email.toString();
    const password: string = req.body.password.toString();
    const response: any = await UserController.login({ email, password });
    res.status(200).json({ status: 'ok', data: response });
  } catch (error: any) {
    next(error);
  }
});

router.get(
  '/check',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'readOwn'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUserId: string = res.locals.loggedInUser._id;
      const user: User = await UserController.get(loggedInUserId);
      res.status(200).json({ status: 'ok', data: user });
    } catch (error: any) {
      next(error);
    }
  }
);

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userFields: string[] = ['role', 'email', 'name', 'surname', 'password'];
      let userData: User = req.body;
      MiscUtils.hasRequiredData(userData, userFields);
      userData.enabled = true;
      let user: User = Parser.parseUser(userData);
      user.password = userData.password.toString();
      const response: User = await UserController.create(user);
      res.status(200).json({ status: 'ok', data: response });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/:userId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'readAny'),
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
      const userFields: string[] = ['role', 'email', 'name', 'surname', 'enabled'];
      MiscUtils.hasRequiredData(req.body, userFields);
      const userId: string = req.params.userId.toString();
      const userData: User = Parser.parseUser(req.body);
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
