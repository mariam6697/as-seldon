import { Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { UserController } from '../controllers/user.controller';

const router: Router = Router();

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('user', 'createAny'),
  UserController.create
);
router.post('/login', UserController.login);

export default router;
