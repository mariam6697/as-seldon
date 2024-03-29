import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import Parser from '../../infrastructure/utils/parser.utils';
import { ResourceLinkController } from '../controllers/resource-link.controller';
import ResourceLink from '../models/resource-link.model';

const router: Router = Router();

router.post(
  '/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('resourceLink', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.projectId.toString();
      const resourceLinkData: ResourceLink = Parser.parseResourceLink(req.body);
      const resourceLink: ResourceLink = await ResourceLinkController.create(
        projectId,
        resourceLinkData
      );
      res.status(200).json({ status: 'ok', data: resourceLink });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get('/:projectNanoId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectNanoId: string = req.params.projectNanoId.toString();
    const page: number = req.query.page ? parseInt(req.query.page.toString()) : 1;
    const limit: number = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
    const result: any = await ResourceLinkController.getByProjectNanoId(projectNanoId, page, limit);
    res.status(200).json({ status: 'ok', data: result });
  } catch (error: any) {
    next(error);
  }
});

router.put(
  '/:resourceLinkId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('resourceLink', 'updateAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceLinkId: string = req.params.resourceLinkId.toString();
      const resourceLinkData: ResourceLink = Parser.parseResourceLink(req.body);
      const resourceLink: ResourceLink = await ResourceLinkController.update(
        resourceLinkId,
        resourceLinkData
      );
      res.status(200).json({ status: 'ok', data: resourceLink });
    } catch (error: any) {
      next(error);
    }
  }
);

router.delete(
  '/:resourceLinkId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('resourceLink', 'deleteAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceLinkId: string = req.params.resourceLinkId.toString();
      await ResourceLinkController.remove(resourceLinkId);
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
