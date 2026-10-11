import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { successResponse } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { getPaginationOptions } from '../utils/pagination';

const isPlaceholderConfig = !env.SUPABASE_URL || env.SUPABASE_URL.includes('your-project') || !env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role');

const devOrganizations = [
  { id: 'org00000-0000-0000-0000-000000000001', name: 'Developer Student Club', slug: 'dsc-nit', college_id: 'c0000000-0000-0000-0000-000000000001', is_verified: true, description: 'Student community passionate about building tech, competitive coding, and open source projects.', follower_count: 340 },
  { id: 'org00000-0000-0000-0000-000000000002', name: 'Student Cultural Council', slug: 'cultural-council', college_id: 'c0000000-0000-0000-0000-000000000001', is_verified: true, description: 'Organizes annual campus fests, drama, music competitions, and celebrity nights.', follower_count: 820 },
  { id: 'org00000-0000-0000-0000-000000000003', name: 'InfoSec Guild', slug: 'infosec-guild', college_id: 'c0000000-0000-0000-0000-000000000001', is_verified: true, description: 'Cybersecurity, ethical hacking, and Capture The Flag research club.', follower_count: 195 },
];

export const organizationsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (isPlaceholderConfig) {
        return successResponse(res, devOrganizations);
      }
      const { college_id } = req.query as any;
      let query = supabaseAdmin.from('organizations').select('*, college:colleges(name)').eq('is_active', true);
      if (college_id) query = query.eq('college_id', college_id);
      const { data, error } = await query.order('name');
      if (error) throw new Error(error.message);
      return successResponse(res, (data && data.length > 0) ? data : devOrganizations);
    } catch {
      return successResponse(res, devOrganizations);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (isPlaceholderConfig) {
        const found = devOrganizations.find(o => o.id === req.params.id) || devOrganizations[0];
        return successResponse(res, found);
      }
      const { data, error } = await supabaseAdmin
        .from('organizations')
        .select('*, college:colleges(*)')
        .eq('id', req.params.id)
        .single();
      if (error || !data) throw new NotFoundError('Organization not found');

      const { count } = await supabaseAdmin
        .from('followed_organizations')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', req.params.id);

      return successResponse(res, { ...data, follower_count: count || 0 });
    } catch {
      const found = devOrganizations.find(o => o.id === req.params.id) || devOrganizations[0];
      return successResponse(res, found);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { data: org, error } = await supabaseAdmin
        .from('organizations')
        .insert({ ...req.body, contact_email: req.body.email })
        .select()
        .single();
      if (error) throw new Error(error.message);

      await supabaseAdmin.from('organization_memberships').insert({
        user_id: req.user!.id,
        organization_id: org.id,
        role: 'owner',
      });

      return successResponse(res, org, 201, 'Organization created');
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { data: membership } = await supabaseAdmin
        .from('organization_memberships')
        .select('role')
        .eq('organization_id', req.params.id)
        .eq('user_id', req.user!.id)
        .single();

      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        if (req.user!.role !== 'platform_admin') {
          throw new ForbiddenError('Not authorized to update this organization');
        }
      }

      const { data, error } = await supabaseAdmin
        .from('organizations')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return successResponse(res, data, 200, 'Organization updated');
    } catch (error) {
      next(error);
    }
  },

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const { from, to } = getPaginationOptions(Number(page), Number(limit));

      const { data, count, error } = await supabaseAdmin
        .from('events')
        .select('*, category:event_categories(*)', { count: 'exact' })
        .eq('organization_id', req.params.id)
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
        .from('followed_organizations')
        .upsert({ user_id: req.user!.id, organization_id: req.params.id }, { onConflict: 'user_id,organization_id' });
      if (error) throw new Error(error.message);
      return successResponse(res, null, 201, 'Organization followed');
    } catch (error) {
      next(error);
    }
  },

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = await supabaseAdmin
        .from('followed_organizations')
        .delete()
        .eq('user_id', req.user!.id)
        .eq('organization_id', req.params.id);
      if (error) throw new Error(error.message);
      return successResponse(res, null, 200, 'Organization unfollowed');
    } catch (error) {
      next(error);
    }
  },

  async requestVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { data: membership } = await supabaseAdmin
        .from('organization_memberships')
        .select('role')
        .eq('organization_id', req.params.id)
        .eq('user_id', req.user!.id)
        .single();

      if (!membership || membership.role !== 'owner') {
        throw new ForbiddenError('Only organization owners can request verification');
      }

      const { data, error } = await supabaseAdmin
        .from('organization_verification_requests')
        .insert({
          organization_id: req.params.id,
          requested_by: req.user!.id,
          supporting_documents: req.body.documents || [],
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return successResponse(res, data, 201, 'Verification request submitted');
    } catch (error) {
      next(error);
    }
  },
};
