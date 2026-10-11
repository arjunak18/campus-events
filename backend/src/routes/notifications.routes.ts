import { Router } from 'express';
import { notificationsController } from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/notifications', authenticate, notificationsController.list);
router.get('/notifications/unread-count', authenticate, notificationsController.unreadCount);
router.patch('/notifications/:id/read', authenticate, notificationsController.markRead);
router.post('/notifications/read-all', authenticate, notificationsController.markAllRead);

export default router;
