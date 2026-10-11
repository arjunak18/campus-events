import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { successResponse } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { getPaginationOptions } from '../utils/pagination';

export const adminController = {
  async listReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, status } = req.query as any;
      const { from, to } = getPaginationOptions(Number(page), Number(limit));

      let query = supabaseAdmin
        .from('event_reports')
        .select('*, event:events(title, id), reporter:profiles!event_reports_reporter_id_fkey(display_name, email)', { count: 'exact' });

      if (status) query = query.eq('status', status);
      const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

      if (error) throw new Error(error.message);
      return successResponse(res, {
        data: data || [],
        pagination: { page: Number(page), limit: Number(limit), total: count || 0, totalPages: Math.ceil((count || 0) / Number(limit)) },
      });
    } catch (error) {
      next(error);
    }
  },

  async reviewReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, reviewer_notes } = req.body;
      const { data, error } = await supabaseAdmin
        .from('event_reports')
        .update({ status, reviewer_notes, reviewer_id: req.user!.id })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new NotFoundError('Report not found');
      return successResponse(res, data, 200, 'Report reviewed');
    } catch (error) {
      next(error);
    }
  },

  async listVerificationRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('organization_verification_requests')
        .select('*, organization:organizations(name, college:colleges(name)), requester:profiles!organization_verification_requests_requested_by_fkey(display_name)')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return successResponse(res, data);
    } catch (error) {
      next(error);
    }
  },

  async reviewVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, reviewer_notes } = req.body;
      const { data, error } = await supabaseAdmin
        .from('organization_verification_requests')
        .update({ status, reviewer_notes, reviewer_id: req.user!.id })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new NotFoundError('Verification request not found');

      // If approved, update organization
      if (status === 'approved') {
        await supabaseAdmin
          .from('organizations')
          .update({ is_verified: true, verification_date: new Date().toISOString() })
          .eq('id', data.organization_id);
      }

      return successResponse(res, data, 200, `Verification ${status}`);
    } catch (error) {
      next(error);
    }
  },

  async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const [users, events, registrations, organizations, reports] = await Promise.all([
        supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('events').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('event_registrations').select('*', { count: 'exact', head: true }).eq('status', 'registered'),
        supabaseAdmin.from('organizations').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('event_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return successResponse(res, {
        total_users: users.count || 0,
        total_events: events.count || 0,
        total_registrations: registrations.count || 0,
        total_organizations: organizations.count || 0,
        pending_reports: reports.count || 0,
      });
    } catch (error) {
      next(error);
    }
  },
};
