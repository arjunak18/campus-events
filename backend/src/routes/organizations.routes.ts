import { Router } from 'express';
import { organizationsController } from '../controllers/organizations.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../schemas/common.schema';
import { createOrganizationSchema, updateOrganizationSchema } from '../schemas/organizations.schema';

const router = Router();

router.get('/', organizationsController.list);
router.get('/:id', validate({ params: uuidParamSchema }), organizationsController.getById);
router.post('/', authenticate, validate({ body: createOrganizationSchema }), organizationsController.create);
router.patch('/:id', authenticate, validate({ params: uuidParamSchema, body: updateOrganizationSchema }), organizationsController.update);
router.get('/:id/events', validate({ params: uuidParamSchema }), organizationsController.getEvents);
router.post('/:id/follow', authenticate, validate({ params: uuidParamSchema }), organizationsController.follow);
router.delete('/:id/follow', authenticate, validate({ params: uuidParamSchema }), organizationsController.unfollow);
router.post('/:id/verification-request', authenticate, organizationsController.requestVerification);

export default router;
