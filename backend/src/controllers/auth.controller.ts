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
      const user = req.user!;
      let { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*, college:colleges(*)')
        .eq('id', user.id)
        .maybeSingle();

      if (!data) {
        // Automatically create user profile if first time logging in (e.g. from Google or email)
        let displayName = user.email?.split('@')[0] || 'Student';
        let avatarUrl: string | null = null;

        try {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
          const meta = authUser?.user?.user_metadata || {};
          displayName = meta.full_name || meta.name || meta.display_name || displayName;
          avatarUrl = meta.avatar_url || meta.picture || null;
        } catch {
          // ignore admin lookup error
        }

        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            display_name: displayName,
            avatar_url: avatarUrl,
            role: user.role || 'student',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
          .select('*, college:colleges(*)')
          .single();

        if (insertError) {
          data = {
            id: user.id,
            email: user.email,
            display_name: displayName,
            avatar_url: avatarUrl,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        } else {
          data = newProfile;
        }
      } else {
        // Record login activity
        await supabaseAdmin
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }

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
