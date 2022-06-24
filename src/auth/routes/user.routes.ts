import { Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import User from '../models/user.model';

const router: Router = Router();

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

export default router;
