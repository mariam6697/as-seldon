import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticationMiddleware } from '../../infrastructure/middleware/authentication.middleware';
import Parser from '../../infrastructure/utils/parser.utils';
import { CategoryController } from '../controllers/category.controller';
import Category from '../models/category.model';

const router: Router = Router();

router.post(
  '/',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('category', 'createAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData: Category = Parser.parseCategory(req.body);
      const category: Category = await CategoryController.create(categoryData);
      res.status(200).json({ status: 'ok', data: category });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/:categoryId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('category', 'readAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId: string = req.params.categoryId;
      const category: Category = await CategoryController.get(categoryId);
      res.status(200).json({ status: 'ok', data: category });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/label/:categoryLabel',
  // AuthenticationMiddleware.allowIfLoggedIn,
  // AuthenticationMiddleware.grantAccess('category', 'readAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const catLabel: string = req.params.categoryLabel.toString();
      const category: Category = await CategoryController.getByLabel(catLabel);
      res.status(200).json({ status: 'ok', data: category });
    } catch (error: any) {
      next(error);
    }
  }
);

router.get(
  '/',
  // AuthenticationMiddleware.allowIfLoggedIn,
  // AuthenticationMiddleware.grantAccess('category', 'readAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page: number = parseInt(req.query.page as string);
      const limit: number = parseInt(req.query.limit as string);
      const result: any = await CategoryController.getAll(page, limit);
      res.status(200).json({ status: 'ok', data: result });
    } catch (error: any) {
      next(error);
    }
  }
);

router.put(
  '/:categoryId',
  AuthenticationMiddleware.allowIfLoggedIn,
  AuthenticationMiddleware.grantAccess('category', 'updateAny'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId: string = req.params.categoryId.toString();
      const categoryData: Category = Parser.parseCategory(req.body);
      const category: Category = await CategoryController.update(categoryId, categoryData);
      res.status(200).json({ status: 'ok', data: category });
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
