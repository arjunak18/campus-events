import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, displayName, collegeId } = req.body;
      const userId = req.user!.id;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email,
          display_name: displayName,
          college_id: collegeId || null,
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw new BadRequestError(error.message);
      return successResponse(res, data, 201, 'Profile created');
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*, college:colleges(*)')
        .eq('id', req.user!.id)
        .single();

      if (error || !data) throw new NotFoundError('Profile not found');
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(req.body)
        .eq('id', req.user!.id)
        .select('*, college:colleges(*)')
        .single();

      if (error) throw new BadRequestError(error.message);
      return successResponse(res, data, 200, 'Profile updated');
    } catch (error) {
      next(error);
    }
  },

  async updatePushToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { push_token } = req.body;
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ push_token })
        .eq('id', req.user!.id);

      if (error) throw new BadRequestError(error.message);
      return successResponse(res, null, 200, 'Push token updated');
    } catch (error) {
      next(error);
    }
  },
};
