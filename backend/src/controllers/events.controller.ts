import { Request, Response, NextFunction } from 'express';
import { eventsService } from '../services/events.service';
import { successResponse, paginatedResponse } from '../utils/response';
import { getPaginationParams, getPaginationMetadata } from '../utils/pagination';

export const eventsController = {
  async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const { page, limit } = getPaginationParams(req);
      
      const { data, total } = await eventsService.getEvents(query);
      const pagination = getPaginationMetadata(total, page, limit);
      
      return paginatedResponse(res, data, pagination, 200, 'Events retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const event = await eventsService.getEventById(id);
      return successResponse(res, event, 200, 'Event retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const event = await eventsService.createEvent(req.body, userId);
      return successResponse(res, event, 201, 'Event created successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const event = await eventsService.updateEvent(id, req.body, req.user!.id, req.user!.role);
      return successResponse(res, event, 200, 'Event updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await eventsService.deleteEvent(id, req.user!.id, req.user!.role);
      return successResponse(res, null, 200, 'Event deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};
