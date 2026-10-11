import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsService } from '../services/organizations.service';

export const useOrganizations = (collegeId?: string) => {
  return useQuery({
    queryKey: ['organizations', { collegeId }],
    queryFn: () => organizationsService.getOrganizations(collegeId),
    staleTime: 1000 * 60 * 10,
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationsService.getOrganizationById(id),
    enabled: !!id,
  });
};

export const useFollowOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organizationsService.followOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useUnfollowOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organizationsService.unfollowOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};
