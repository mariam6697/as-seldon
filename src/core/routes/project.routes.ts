import { Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { ProjectController } from '../controllers/project.controller';
import { NextFunction, Request, Response } from 'express';
import Project from '../models/project.model';

const router: Router = Router();

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData: Project = req.body;
      const project: Project = await ProjectController.create(projectData);
      res.status(200).json({ status: 'ok', data: project });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get('/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId: string = req.params.projectId;
    const project: Project = await ProjectController.get(projectId);
    res.status(200).json({ status: 'ok', data: project });
  } catch (error: any) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const highlighted: boolean = req.query.highlighted
      ? req.query.highlighted === 'true'
        ? true
        : false
      : null;
    const search: string = req.query.search ? (req.query.search as string) : null;
    const result: any = await ProjectController.getAll(page, limit, highlighted, search);
    res.status(200).json({ status: 'ok', data: result });
  } catch (error: any) {
    next(error);
  }
});

router.put(
  '/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'updateAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.projectId;
      const projectData: Project = req.body;
      const project: Project = await ProjectController.update(projectId, projectData);
      res.status(200).json({ status: 'ok', data: project });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
