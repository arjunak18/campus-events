import { useQuery } from '@tanstack/react-query';
import { collegesService } from '../services/colleges.service';

export const useColleges = () => {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: collegesService.getColleges,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCollege = (id: string) => {
  return useQuery({
    queryKey: ['colleges', id],
    queryFn: () => collegesService.getCollegeById(id),
    enabled: !!id,
  });
};
