import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import Parser from '../../infrastructure/utils/parser.utils';
import { ProjectUpdateController } from '../controllers/project-update.controller';
import { ProjectUpdate } from '../models/project.model';

const router: Router = Router();

router.post(
  '/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.projectId.toString();
      const projectUpdateData: ProjectUpdate = Parser.parseProjectUpdate(req.body);
      const projectUpdate: ProjectUpdate = await ProjectUpdateController.create(
        projectId,
        projectUpdateData
      );
      res.status(200).json({ status: 'ok', data: projectUpdate });
    } catch (error: any) {
      next(error);
    }
  }
);

router.put(
  '/:projectUpdateId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'updateAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectUpdateId: string = req.params.projectUpdateId.toString();
      const projectUpdateData: ProjectUpdate = Parser.parseProjectUpdate(req.body);
      const projectUpdate: ProjectUpdate = await ProjectUpdateController.update(
        projectUpdateId,
        projectUpdateData
      );
      res.status(200).json({ status: 'ok', data: projectUpdate });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'readAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.projectId.toString();
      const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1;
      const limit: number = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
      const result: any = await ProjectUpdateController.getByProjectId(projectId, page, limit);
      res.status(200).json({ status: 'ok', data: result });
    } catch (error: any) {
      next(error);
    }
  }
);

router.delete(
  '/:projectUpdateId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'deleteAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectUpdateId: string = req.params.projectUpdateId.toString();
      await ProjectUpdateController.remove(projectUpdateId);
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
