import { Router } from 'express';
import { registrationsController } from '../controllers/registrations.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uuidParamSchema } from '../schemas/common.schema';

const router = Router();

// Event registrations (mounted under /events)
router.post('/:id/registrations', authenticate, validate({ params: uuidParamSchema }), registrationsController.register);
router.delete('/:id/registrations/me', authenticate, validate({ params: uuidParamSchema }), registrationsController.cancel);

export default router;
