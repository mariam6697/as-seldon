import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import { ProjectController } from '../controllers/project.controller';
import Project from '../models/project.model';

const router: Router = Router();

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData: Project = {
        name: req.body.name.toString(),
        description: req.body.description.toString(),
        shortDescription: req.body.shortDescription.toString(),
        highlighted: req.body.highlighted.toString() == 'true' ? true : false,
        visible: req.body.visible.toString() == 'true' ? true : false,
        semester: req.body.semester.toString(),
        year: req.body.year.toString()
      };
      const project: Project = await ProjectController.create(projectData);
      res.status(200).json({ status: 'ok', data: project });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get('/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId: string = req.params.projectId.toString();
    const project: Project = await ProjectController.get(projectId);
    res.status(200).json({ status: 'ok', data: project });
  } catch (error: any) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1;
    const limit: number = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
    const highlight: string = req.query.highlighted ? req.query.highlighted.toString() : null;
    const highlighted: boolean = highlight === 'true' ? true : false;
    const search: string = req.query.search ? req.query.search.toString() : null;
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
      const projectId: string = req.params.projectId.toString();
      const projectData: Project = {
        name: req.body.name.toString(),
        description: req.body.description.toString(),
        shortDescription: req.body.shortDescription.toString(),
        highlighted: req.body.highlighted.toString() == 'true' ? true : false,
        visible: req.body.visible.toString() == 'true' ? true : false,
        semester: req.body.semester.toString(),
        year: req.body.year.toString()
      };
      const project: Project = await ProjectController.update(projectId, projectData);
      res.status(200).json({ status: 'ok', data: project });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
