import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
import { apiClient } from '@/lib/apiClient';
import axios from '@/libs/axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

export const useTodoList = () => {
  const { control, handleSubmit, reset } = useForm<{ title: string }>({
    defaultValues: {
      title: '',
    },
  });
  const [isHandleLoading, setIsHandleLoading] = React.useState<boolean>(false);

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

  const handleAddTodo = React.useCallback(async () => {
    handleSubmit(async (formData) => {
      const { title } = formData;
      setIsHandleLoading(true);
      await axios.post(
        '/v1/tasks',
        {
          title,
          is_public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
          },
        }
      );
      await mutate();
      setIsHandleLoading(false);
      reset();
    })();
  }, [mutate, reset, handleSubmit]);

  return {
    control,
    isLoading,
    isHandleLoading,
    todos,
    handleAddTodo,
    mutate,
  };
};
