import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { getPaginationOptions } from '../utils/pagination';

export const savedEventsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const { from, to } = getPaginationOptions(Number(page), Number(limit));

      const { data, count, error } = await supabaseAdmin
        .from('saved_events')
        .select('*, event:events(*, category:event_categories(*), organization:organizations(name, logo_url), college:colleges(name))', { count: 'exact' })
        .eq('user_id', req.user!.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        return successResponse(res, []);
      }
      return successResponse(res, data || []);
    } catch (error) {
      next(error);
    }
  },

  async save(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('saved_events')
        .upsert(
          { user_id: req.user!.id, event_id: req.params.eventId },
          { onConflict: 'user_id,event_id' }
        );

      if (error) throw new Error(error.message);
      return successResponse(res, null, 201, 'Event saved');
    } catch (error) {
      next(error);
    }
  },

  async unsave(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('saved_events')
        .delete()
        .eq('user_id', req.user!.id)
        .eq('event_id', req.params.eventId);

      if (error) throw new Error(error.message);
      return successResponse(res, null, 200, 'Event unsaved');
    } catch (error) {
      next(error);
    }
  },
};
