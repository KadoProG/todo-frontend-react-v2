import { apiClient } from '@/lib/apiClient';
import useSWR from 'swr';

export const useTaskActions = (id: string | undefined) => {
  const params = id
    ? {
        task: id,
        url: '/v1/tasks/{task}/actions',
      }
    : null;

  const { data, isLoading, mutate } = useSWR(
    params,
    (params) =>
      apiClient.GET('/v1/tasks/{task}/actions', {
        params: {
          path: {
            task: Number(params.task),
          },
        },
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const actions = data?.data?.actions;

  return {
    actions,
    isLoading,
    mutate,
  };
};
