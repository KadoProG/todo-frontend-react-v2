import { useSnackbarContext } from '@/components/common/feedback/snackbarContext';
import { apiClient } from '@/lib/apiClient';
import { useCallback, useState } from 'react';

export const useTodoCreate = ({ mutate }: { mutate?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarContext();

  const createTodo = useCallback(
    async (data: {
      title: string;
      description?: string;
      is_done?: boolean;
      is_public: boolean;
      expired_at?: string;
    }) => {
      try {
        setIsSubmitting(true);
        const res = await apiClient.POST('/v1/tasks', {
          body: {
            title: data.title,
            description: data.description,
            is_done: data.is_done,
            is_public: data.is_public,
            expired_at: data.expired_at ? new Date(data.expired_at).toISOString() : null,
          },
        });
        setIsSubmitting(false);
        if (!res.response.ok) {
          if (res.response.status === 401) {
            // mutate();
          } else if (res.response.status === 422) {
            showSnackbar({ message: '入力内容に誤りがあります。', type: 'warning' });
          } else if (res.response.status === 403) {
            showSnackbar({ message: '権限がありません。', type: 'error' });
          } else {
            showSnackbar({ message: 'エラーが発生しました。', type: 'error' });
          }
          return false;
        }
        showSnackbar({ message: 'タスクを作成しました', type: 'success' });
        mutate?.();
        return true;
      } catch (e) {
        setIsSubmitting(false);
        console.error(e);
        showSnackbar({ message: 'エラーが発生しました。', type: 'error' });
      }
      setIsSubmitting(false);
    },
    [showSnackbar, mutate]
  );
  return { createTodo, isSubmitting, showSnackbar };
};
