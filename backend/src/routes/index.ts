import { Router } from 'express';
import authRoutes from './auth.routes';
import eventsRoutes from './events.routes';
import collegesRoutes from './colleges.routes';
import organizationsRoutes from './organizations.routes';
import registrationsRoutes from './registrations.routes';
import savedEventsRoutes from './savedEvents.routes';
import notificationsRoutes from './notifications.routes';
import reportsRoutes from './reports.routes';
import adminRoutes from './admin.routes';
import { registrationsController } from '../controllers/registrations.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/events', registrationsRoutes);
router.use('/colleges', collegesRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/me', savedEventsRoutes);
router.use('/me', notificationsRoutes);
router.use('/', reportsRoutes);
router.use('/admin', adminRoutes);

// User's registrations (under /me)
router.get('/me/registrations', authenticate, registrationsController.myRegistrations);

export default router;
