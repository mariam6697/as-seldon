import { Router } from 'express';
import { ENV } from '../../infrastructure/config/env.config';
import ProjectRoutes from './project.routes';
import RepositoryRoutes from './repository.routes';

const router: Router = Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'ok',
    version: ENV.apiVersion,
    info: 'AS Seldon Admin Module'
  });
});

router.use('/projects', ProjectRoutes);
router.use('/repositories', RepositoryRoutes);

export default router;
