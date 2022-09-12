import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import File from '../models/file.model';
import { FileController } from '../controllers/file.controller';

const router: Router = Router();

router.post(
  '/project/main/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'updateAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileData: File = {
        extension: req.body.extension.toString(),
        size: parseInt(req.body.size.toString()),
        type: req.body.type.toString(),
        base64: req.body.base64.toString()
      };
      const projectId: string = req.params.projectId.toString();
      const file: File = await FileController.addProjectMainImage(projectId, fileData);
      res.status(200).json({ status: 'ok', data: file });
    } catch (error: any) {
      next(error);
    }
  }
);

router.post(
  '/project/extra/:projectId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('project', 'updateAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileData: File = {
        extension: req.body.extension.toString(),
        size: parseInt(req.body.size.toString()),
        type: req.body.type.toString(),
        base64: req.body.base64.toString()
      };
      const projectId: string = req.params.projectId.toString();
      const file: File = await FileController.addProjectExtraImage(projectId, fileData);
      res.status(200).json({ status: 'ok', data: file });
    } catch (error: any) {
      next(error);
    }
  }
);

router.delete(
  '/:fileId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('file', 'deleteAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileId: string = req.params.fileId.toString();
      await FileController.delete(fileId);
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
