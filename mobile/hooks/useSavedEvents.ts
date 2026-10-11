import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedEventsService } from '../services/savedEvents.service';

export const useSavedEvents = () => {
  return useQuery({
    queryKey: ['saved-events'],
    queryFn: savedEventsService.getSavedEvents,
  });
};

export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => savedEventsService.saveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUnsaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => savedEventsService.unsaveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
