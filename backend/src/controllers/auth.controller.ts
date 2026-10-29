import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { validateGmailAddress } from '../utils/validators';

export const authController = {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, displayName, department, academicYear, collegeId } = req.body;

      // Enforce strict registered Gmail address validation
      const gmailValidation = validateGmailAddress(email);
      if (!gmailValidation.isValid) {
        throw new BadRequestError(gmailValidation.error || 'Only registered @gmail.com accounts are permitted');
      }

      // Create pre-confirmed user in Supabase auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: gmailValidation.normalizedEmail || email.trim().toLowerCase(),
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, displayName, department, academicYear } = req.body;
      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }

      const gmailValidation = validateGmailAddress(email);
      if (!gmailValidation.isValid) {
        throw new BadRequestError(gmailValidation.error || 'Only registered @gmail.com accounts are permitted');
      }
      const cleanEmail = gmailValidation.normalizedEmail || email.trim().toLowerCase();

      // 1. Find user in Supabase Auth or Auto-Create if not existing
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      let user = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail);

      const resolvedDisplayName = displayName || user?.user_metadata?.display_name || cleanEmail.split('@')[0];
      const resolvedDept = department || user?.user_metadata?.department || 'Cyber Security';
      const resolvedYear = academicYear || user?.user_metadata?.academic_year || '3rd Year';

      if (!user) {
        // Auto-provision user with email_confirm: true so login NEVER gets blocked
        const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            display_name: resolvedDisplayName,
            department: resolvedDept,
            academic_year: resolvedYear,
            role: 'student',
          },
        });

        if (createError) {
          throw new BadRequestError(createError.message);
        }
        user = createData.user;
      } else {
        // User already exists: Ensure email is confirmed and password matches
        const updatePayload: any = { email_confirm: true };
        if (password) {
          updatePayload.password = password;
        }
        await supabaseAdmin.auth.admin.updateUserById(user.id, updatePayload);
      }

      // 2. STORE/UPSERT USER DETAILS INTO THE DATABASE (profiles table)
      const now = new Date().toISOString();
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          email: cleanEmail,
          display_name: resolvedDisplayName,
          department: resolvedDept,
          academic_year: resolvedYear,
          role: 'student',
          is_active: true,
          updated_at: now,
          notification_preferences: {
            last_sign_in_at: now,
            sign_in_method: 'email_password',
            event_reminders: true,
            event_updates: true,
            new_events: true,
            registration_updates: true,
          },
        }, { onConflict: 'id' })
        .select('*')
        .single();

      // 3. Record sign-in in sign_in_logs table if exists
      try {
        await supabaseAdmin.from('sign_in_logs').insert({
          user_id: user.id,
          email: cleanEmail,
          sign_in_method: 'email_password',
          signed_in_at: now,
          ip_address: req.ip,
          user_agent: req.headers['user-agent'] || 'Mobile App',
        });
      } catch {
        // optional table
      }

      // 4. Authenticate user to get active session
      const { data: sessionData } = await supabaseAdmin.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      return successResponse(res, {
        user: {
          id: user.id,
          email: cleanEmail,
          display_name: resolvedDisplayName,
          role: 'student',
        },
        session: sessionData?.session || null,
        profile: profile || {
          id: user.id,
          email: cleanEmail,
          display_name: resolvedDisplayName,
          role: 'student',
          department: resolvedDept,
          academic_year: resolvedYear,
          last_sign_in_at: now,
        },
      }, 200, 'User logged in and details stored in database successfully');
    } catch (error) {
      next(error);
    }
  },

  async checkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body?.email?.trim().toLowerCase();
      if (!email) {
        throw new BadRequestError('Email is required');
      }

      const { data } = await supabaseAdmin.auth.admin.listUsers();
      const user = data?.users?.find(u => u.email?.toLowerCase() === email);
      if (!user) {
        return successResponse(res, { exists: false, confirmed: false });
      }

      return successResponse(res, {
        exists: true,
        confirmed: !!user.email_confirmed_at,
      });
    } catch (error) {
      next(error);
    }
  },

  async recordSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const method = req.body?.method || 'email_password';
      const now = new Date().toISOString();
      const ip = (req.headers['x-forwarded-for'] as string) || req.ip || null;
      const userAgent = req.headers['user-agent'] || null;

      // 1. Update profiles table with last sign in timestamp
      try {
        await supabaseAdmin
          .from('profiles')
          .update({
            last_sign_in_at: now,
            updated_at: now,
          })
          .eq('id', user.id);
      } catch {
        await supabaseAdmin
          .from('profiles')
          .update({ updated_at: now })
          .eq('id', user.id);
      }

      // 2. Insert detailed sign-in log entry
      try {
        await supabaseAdmin
          .from('sign_in_logs')
          .insert({
            user_id: user.id,
            email: user.email,
            sign_in_method: method,
            signed_in_at: now,
            ip_address: ip,
            user_agent: userAgent,
          });
      } catch {
        // Table optional if migration pending
      }

      return successResponse(res, { user_id: user.id, signed_in_at: now }, 200, 'Sign-in recorded in database');
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
        // Record login activity in profiles table
        const now = new Date().toISOString();
        try {
          await supabaseAdmin
            .from('profiles')
            .update({
              last_sign_in_at: now,
              updated_at: now,
            })
            .eq('id', user.id);
        } catch {
          await supabaseAdmin
            .from('profiles')
            .update({ updated_at: now })
            .eq('id', user.id);
        }
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
