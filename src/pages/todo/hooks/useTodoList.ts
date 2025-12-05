import { apiClient } from '@/lib/apiClient';
import React from 'react';
import useSWR from 'swr';

export const useTodoList = () => {
  const { isLoading, data, mutate } = useSWR(
    '/v1/users/me/tasks',
    () => apiClient.GET('/v1/users/me/tasks'),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const todos = React.useMemo(() => data?.data?.tasks ?? [], [data]);

  return {
    isLoading,
    todos,
    mutate,
  };
};
