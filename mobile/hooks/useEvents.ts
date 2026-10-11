import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as eventsService from '../services/events.service';
import { Event } from '../types';

export const useEvents = (params?: eventsService.EventQueryParams) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsService.getEvents(params),
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEventById(id),
    enabled: !!id,
  });
};

export const useEventsByDate = (date: string, collegeId?: string) => {
  return useQuery({
    queryKey: ['events', 'date', date, collegeId],
    queryFn: () => eventsService.getEventsByDate(date, collegeId),
    enabled: !!date,
  });
};

export const useUpcomingEvents = (limit?: number) => {
  return useQuery({
    queryKey: ['events', 'upcoming', limit],
    queryFn: () => eventsService.getUpcomingEvents(limit),
  });
};

export const usePopularEvents = (limit?: number) => {
  return useQuery({
    queryKey: ['events', 'popular', limit],
    queryFn: () => eventsService.getPopularEvents(limit),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => eventsService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => eventsService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsService.deleteEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.removeQueries({ queryKey: ['event', id] });
    },
  });
};
