import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { successResponse } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { getPaginationOptions } from '../utils/pagination';

const isPlaceholderConfig = !env.SUPABASE_URL || env.SUPABASE_URL.includes('your-project') || !env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role');

const devColleges = [
  { id: 'c0000000-0000-0000-0000-000000000001', name: 'National Institute of Technology', short_name: 'NIT', location: 'Trichy, Tamil Nadu', is_active: true, description: 'Premier public technical and research university.' },
  { id: 'c0000000-0000-0000-0000-000000000002', name: 'Indian Institute of Science & Tech', short_name: 'IIST', location: 'Bengaluru, Karnataka', is_active: true, description: 'Deemed university for engineering, technology, and space science.' },
  { id: 'c0000000-0000-0000-0000-000000000003', name: 'Delhi Technological University', short_name: 'DTU', location: 'New Delhi, Delhi', is_active: true, description: 'Historic institution fostering technical innovation and campus festivals.' },
];

export const collegesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (isPlaceholderConfig) {
        return successResponse(res, devColleges);
      }
      const { data, error } = await supabaseAdmin
        .from('colleges')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw new Error(error.message);
      return successResponse(res, data || devColleges);
    } catch {
      return successResponse(res, devColleges);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (isPlaceholderConfig) {
        const found = devColleges.find(c => c.id === req.params.id) || devColleges[0];
        return successResponse(res, found);
      }
      const { data, error } = await supabaseAdmin
        .from('colleges')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !data) throw new NotFoundError('College not found');
      return successResponse(res, data);
    } catch {
      const found = devColleges.find(c => c.id === req.params.id) || devColleges[0];
      return successResponse(res, found);
    }
  },

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const { from, to } = getPaginationOptions(Number(page), Number(limit));

      const { data, count, error } = await supabaseAdmin
        .from('events')
        .select('*, category:event_categories(*), organization:organizations(*)', { count: 'exact' })
        .eq('college_id', req.params.id)
        .eq('status', 'published')
        .order('start_date', { ascending: true })
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

  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('followed_colleges')
        .upsert({ user_id: req.user!.id, college_id: req.params.id }, { onConflict: 'user_id,college_id' });

      if (error) throw new Error(error.message);
      return successResponse(res, null, 201, 'College followed');
    } catch (error) {
      next(error);
    }
  },

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('followed_colleges')
        .delete()
        .eq('user_id', req.user!.id)
        .eq('college_id', req.params.id);

      if (error) throw new Error(error.message);
      return successResponse(res, null, 200, 'College unfollowed');
    } catch (error) {
      next(error);
    }
  },
};
