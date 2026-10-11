import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReportSchema } from '../schemas/reports.schema';
import { uuidParamSchema } from '../schemas/common.schema';

const router = Router();

router.post('/events/:id/reports', authenticate, validate({ params: uuidParamSchema, body: createReportSchema }), reportsController.create);

export default router;
