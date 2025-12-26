import useSWR from 'swr';

import { apiClient } from '@/lib/apiClient';

export const useUsers = () => {
  const { data, isLoading } = useSWR('/v1/users', () => apiClient.GET('/v1/users'));

  const users = data?.data?.users;

  return { isLoading, users };
};
