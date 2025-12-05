import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';
import { useCallback, useContext, useState } from 'react';

export const useAddTaskAction = (id: string | undefined, mutate: () => void) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTaskAction = useCallback(async () => {
    if (!id) return;
    const name = window.prompt('タイトルを入力してください。');
    if (!name) return;
    setIsSubmitting(true);
    const res = await apiClient.POST('/v1/tasks/{task}/actions', {
      params: {
        path: {
          task: Number(id),
        },
      },
      body: {
        name,
      },
    });
    setIsSubmitting(false);
    if (!res.response.ok) {
      showSnackbar({ message: '失敗', type: 'error' });
      return;
    }
    showSnackbar({ message: 'アクションを追加しました', type: 'success' });
    mutate();
  }, [id, mutate, showSnackbar]);

  return { addTaskAction, isSubmitting };
};
