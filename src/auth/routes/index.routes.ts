import { Router } from 'express';
import { ENV } from '../../infrastructure/config/env.config';
import UserRoutes from './user.routes';

const router: Router = Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'ok',
    version: ENV.apiVersion,
    info: 'AS Seldon Auth Module'
  });
});

router.use('/users', UserRoutes);

export default router;
