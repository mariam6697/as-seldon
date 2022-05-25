import { Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { ProjectController } from '../controllers/project.controller';

const router: Router = Router();

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'createAny'),
  ProjectController.create
);

export default router;
