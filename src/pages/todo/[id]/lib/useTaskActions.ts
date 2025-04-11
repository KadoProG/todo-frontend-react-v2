import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
        },
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error) => {
        // eslint-disable-next-line
        console.error(error);
      },
    }
  );
  const actions = data?.data?.actions;

  return {
    actions,
    isLoading,
    mutate,
  };
};
