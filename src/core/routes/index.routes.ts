import { Router } from 'express';
import { ENV } from '../../infrastructure/config/env.config';
import ProjectRoutes from './project.routes';

const router: Router = Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'ok',
    version: ENV.apiVersion,
    info: 'AS Seldon Core Module'
  });
});

router.use('/projects', ProjectRoutes);

export default router;
