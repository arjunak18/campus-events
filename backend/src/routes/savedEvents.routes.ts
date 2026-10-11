import { Router } from 'express';
import { savedEventsController } from '../controllers/savedEvents.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/saved-events', authenticate, savedEventsController.list);
router.post('/saved-events/:eventId', authenticate, savedEventsController.save);
router.delete('/saved-events/:eventId', authenticate, savedEventsController.unsave);

export default router;
