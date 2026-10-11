import { Router } from 'express';
import { eventsController } from '../controllers/events.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLimiter } from '../middleware/rateLimiter';
import { createEventSchema, updateEventSchema, eventQuerySchema } from '../schemas/events.schema';
import { uuidParamSchema } from '../schemas/common.schema';

const router = Router();

router.get('/', validate({ query: eventQuerySchema }), eventsController.listEvents);
router.get('/:id', validate({ params: uuidParamSchema }), eventsController.getEvent);
router.post('/', authenticate, createLimiter, validate({ body: createEventSchema }), eventsController.createEvent);
router.patch('/:id', authenticate, validate({ params: uuidParamSchema, body: updateEventSchema }), eventsController.updateEvent);
router.delete('/:id', authenticate, validate({ params: uuidParamSchema }), eventsController.deleteEvent);

export default router;
