import { NextFunction, Request, Response, Router } from 'express';
import Repository from '../../core/models/repository.model';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { RepositoryController } from '../controllers/repository.controller';

const router: Router = Router();

router.get(
  '/project/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('repository', 'readAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.projectId.toString();
      const repos: Repository[] = await RepositoryController.getByProjectId(projectId);
      res.status(200).json({ status: 'ok', data: repos });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
