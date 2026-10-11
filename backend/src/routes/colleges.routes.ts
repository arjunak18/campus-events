import { Router } from 'express';
import { collegesController } from '../controllers/colleges.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../schemas/common.schema';

const router = Router();

router.get('/', collegesController.list);
router.get('/:id', validate({ params: uuidParamSchema }), collegesController.getById);
router.get('/:id/events', validate({ params: uuidParamSchema }), collegesController.getEvents);
router.post('/:id/follow', authenticate, validate({ params: uuidParamSchema }), collegesController.follow);
router.delete('/:id/follow', authenticate, validate({ params: uuidParamSchema }), collegesController.unfollow);

export default router;
