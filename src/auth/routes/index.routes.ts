import { Router } from 'express';
import UserRoutes from './user.routes';

const router: Router = Router();

router.get('/', (req, res, next) => {
  res.json({
    status: 'ok',
    version: 'v1',
    info: 'AS Seldon Auth Module'
  });
});

router.use('/users', UserRoutes);

export default router;
