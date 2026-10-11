import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { BadRequestError } from '../utils/errors';

export const reportsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason, description } = req.body;
      const { data, error } = await supabaseAdmin
        .from('event_reports')
        .insert({
          event_id: req.params.id,
          reporter_id: req.user!.id,
          reason,
          description,
        })
        .select()
        .single();

      if (error) throw new BadRequestError(error.message);
      return successResponse(res, data, 201, 'Report submitted');
    } catch (error) {
      next(error);
    }
  },
};
