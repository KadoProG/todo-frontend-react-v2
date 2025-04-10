import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
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
    '/api/v1/tasks',
    async () => {
      const response = await axios.get('/api/v1/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
        },
      });
      return response.data;
    },
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

  const todos: Todo[] = React.useMemo(() => data ?? [], [data]);

  const handleAddTodo = React.useCallback(async () => {
    handleSubmit(async (formData) => {
      const { title } = formData;
      setIsHandleLoading(true);
      await axios.post(
        '/api/v1/tasks',
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
    async (id: Todo['id']) => {
      if (!id) return;
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) return;

      const newTodo: Todo = { ...todo, isDone: !todo.isDone };

      setIsHandleLoading(true);
      await axios.put(`/api/v1/tasks/${id}`, newTodo, {
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
    async (id: Todo['id']) => {
      if (!id) return;
      setIsHandleLoading(true);
      await axios.delete(`/api/v1/tasks/${id}`, {
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
  };
};
