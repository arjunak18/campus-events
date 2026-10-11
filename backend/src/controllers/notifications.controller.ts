import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { getPaginationOptions } from '../utils/pagination';

export const notificationsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const { from, to } = getPaginationOptions(Number(page), Number(limit));

      const { data, count, error } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', req.user!.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return successResponse(res, {
        data: data || [],
        pagination: { page: Number(page), limit: Number(limit), total: count || 0, totalPages: Math.ceil((count || 0) / Number(limit)) },
      });
    } catch (error) {
      next(error);
    }
  },

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('id', req.params.id)
        .eq('user_id', req.user!.id);

      if (error) throw new Error(error.message);
      return successResponse(res, null, 200, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  },

  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', req.user!.id)
        .eq('is_read', false);

      if (error) throw new Error(error.message);
      return successResponse(res, null, 200, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  },

  async unreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { count, error } = await supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user!.id)
        .eq('is_read', false);

      if (error) throw new Error(error.message);
      return successResponse(res, { count: count || 0 });
    } catch (error) {
      next(error);
    }
  },
};
