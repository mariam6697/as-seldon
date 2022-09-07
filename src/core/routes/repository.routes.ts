import { Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { NextFunction, Request, Response } from 'express';
import Repository from '../models/repository.model';
import { RepositoryController } from '../controllers/repository.controller';

const router: Router = Router();

router.post(
  '/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('repository', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files: any[] = req.body.files;
      const projectId: string = req.params.projectId;
      const repoData: Repository = { project: projectId } as Repository;
      const repo: Repository = await RepositoryController.create({ repoData, files });
      res.status(200).json({ status: 'ok', data: repo });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
