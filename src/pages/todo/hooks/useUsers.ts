import { apiClient } from '@/lib/apiClient';
import useSWR from 'swr';

export const useUsers = () => {
  const { data, isLoading } = useSWR('/v1/users', () => apiClient.GET('/v1/users'));

  const users = data?.data?.users;

  return { isLoading, users };
};
