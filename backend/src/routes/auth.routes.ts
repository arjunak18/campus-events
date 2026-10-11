import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerProfileSchema, updateProfileSchema } from '../schemas/auth.schema';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, authenticate, validate({ body: registerProfileSchema }), authController.register);
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, validate({ body: updateProfileSchema }), authController.updateMe);
router.patch('/me/push-token', authenticate, authController.updatePushToken);

export default router;
