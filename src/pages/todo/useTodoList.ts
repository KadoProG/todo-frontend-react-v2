import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
import { apiClient } from '@/lib/apiClient';
import axios from '@/libs/axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

export const useTodoList = () => {
  const { control, handleSubmit, reset } = useForm<{ title: string }>({
    defaultValues: {
      title: '',
    },
  });
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);
  const [isHandleLoading, setIsHandleLoading] = React.useState<boolean>(false);

  const { isLoading, data, mutate } = useSWR(
    '/v1/users/me/tasks',
    () => apiClient.GET('/v1/users/me/tasks'),
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

  const handleUpdateTodo = React.useCallback(
    async (id: number) => {
      if (!id) return;
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) return;

      const newTodo = { ...todo, is_done: !todo.is_done };

      setIsHandleLoading(true);
      await axios.put(`/v1/tasks/${id}`, newTodo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
        },
      });
      await mutate();
      setIsHandleLoading(false);
    },
    [todos, mutate]
  );

  const handleDeleteTodo = React.useCallback(
    async (id: number) => {
      if (!id) return;
      setIsHandleLoading(true);
      await axios.delete(`/v1/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
        },
      });
      await mutate();
      setIsHandleLoading(false);
    },
    [mutate]
  );

  return {
    control,
    isLoading,
    isHandleLoading,
    todos,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    assignedUserIds,
    setAssignedUserIds,
  };
};
