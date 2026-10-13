import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const authController = {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, displayName, department, academicYear, collegeId } = req.body;

      // Enforce registered Gmail address
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!gmailRegex.test(email)) {
        throw new BadRequestError('Only registered @gmail.com accounts are permitted');
      }

      // Create pre-confirmed user in Supabase auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: displayName,
          full_name: displayName,
          department: department || null,
          academic_year: academicYear || null,
          college_id: collegeId || null,
        },
      });

      if (error) {
        if (error.message?.toLowerCase().includes('already') || error.message?.toLowerCase().includes('exists')) {
          throw new BadRequestError('An account with this email already exists. Please sign in.');
        }
        throw new BadRequestError(error.message);
      }

      if (data.user) {
        // Direct upsert to ensure all profile data is immediately stored
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            display_name: displayName,
            department: department || null,
            academic_year: academicYear || null,
            college_id: collegeId || null,
            role: 'student',
            is_active: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
      }

      return successResponse(res, { userId: data.user?.id, email }, 201, 'Student registered successfully');
    } catch (error) {
      next(error);
    }
  },

  async autoConfirm(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body?.email?.trim().toLowerCase();
      if (!email) {
        throw new BadRequestError('Email is required');
      }

      const { data } = await supabaseAdmin.auth.admin.listUsers();
      const user = data?.users?.find(u => u.email?.toLowerCase() === email);
      if (user && !user.email_confirmed_at) {
        await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
        return successResponse(res, { confirmed: true }, 200, 'User auto-confirmed');
      }

      return successResponse(res, { confirmed: false }, 200, 'Already confirmed or not found');
    } catch (error) {
      next(error);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, displayName, collegeId, department, academicYear } = req.body;
      const userId = req.user!.id;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email,
          display_name: displayName,
          college_id: collegeId || null,
          department: department || null,
          academic_year: academicYear || null,
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
        let department: string | null = null;
        let academicYear: string | null = null;
        let collegeId: string | null = null;

        try {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
          const meta = authUser?.user?.user_metadata || {};
          displayName = meta.display_name || meta.full_name || meta.name || displayName;
          avatarUrl = meta.avatar_url || meta.picture || null;
          department = meta.department || null;
          academicYear = meta.academic_year || null;
          collegeId = meta.college_id || null;
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
            department,
            academic_year: academicYear,
            college_id: collegeId,
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
            department,
            academic_year: academicYear,
            college_id: collegeId,
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
