import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import Repository from '../models/repository.model';
import { RepositoryController } from '../controllers/repository.controller';
import { RemoteFile } from '../models/remote.model';

const router: Router = Router();

router.post(
  '/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('repository', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files: RemoteFile[] = req.body.files;
      const projectId: string = req.params.projectId;
      const repo: Repository = await RepositoryController.create(projectId, { files });
      res.status(200).json({ status: 'ok', data: repo });
    } catch (error: any) {
      next(error);
    }
  }
);

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

router.delete(
  '/:repositoryId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('repository', 'deleteAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repositoryId: string = req.params.repositoryId;
      await RepositoryController.remove(repositoryId);
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      next(error);
    }
  }
);

router.delete(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('repository', 'deleteAll'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await RepositoryController.removeAll();
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
