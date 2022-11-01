import { Router } from 'express';
import { ENV } from '../../infrastructure/config/env.config';
import ProjectRoutes from './project.routes';
import FileRoutes from './file.routes';
import CategoryRoutes from './category.routes';
import RepositoryRoutes from './repository.routes';
import ProjectUpdateRoutes from './project-update.routes';
import ResourceLinkRoutes from './resource-link.routes';

const router: Router = Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'ok',
    version: ENV.apiVersion,
    info: 'AS Seldon Core Module'
  });
});

router.use('/projects', ProjectRoutes);
router.use('/files', FileRoutes);
router.use('/categories', CategoryRoutes);
router.use('/repositories', RepositoryRoutes);
router.use('/projects-updates', ProjectUpdateRoutes);
router.use('/resources-links', ResourceLinkRoutes);

export default router;
