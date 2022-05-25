import { Router } from 'express';
import ProjectRoutes from './project.routes';

const router: Router = Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'ok',
    version: 'v1',
    info: 'AS Seldon Core Module'
  });
});

router.use('/projects', ProjectRoutes);

export default router;
