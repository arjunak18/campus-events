import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// All admin routes require platform_admin role
router.use(authenticate);
router.use(requireRole(['platform_admin']));

router.get('/reports', adminController.listReports);
router.patch('/reports/:id', adminController.reviewReport);
router.get('/verification-requests', adminController.listVerificationRequests);
router.patch('/verification-requests/:id', adminController.reviewVerification);
router.get('/stats', adminController.stats);

export default router;
