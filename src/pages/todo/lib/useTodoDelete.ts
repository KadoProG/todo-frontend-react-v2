import { useSnackbarContext } from '@/components/common/feedback/snackbarContext';
import { apiClient } from '@/lib/apiClient';
import { useCallback, useState } from 'react';

export const useTodoDelete = ({ mutate }: { mutate?: () => void }) => {
  const { showSnackbar } = useSnackbarContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteTodo = useCallback(
    async (taskId: number) => {
      try {
        setIsSubmitting(true);
        const res = await apiClient.DELETE('/v1/tasks/{task}', {
          params: {
            path: { task: taskId },
          },
        });
        setIsSubmitting(false);
        if (!res.response.ok) {
          throw new Error('Failed to delete task');
        }
      } catch (e) {
        setIsSubmitting(false);
        console.error(e);
        showSnackbar({
          message: 'タスクの削除に失敗しました',
          type: 'error',
        });
      }
      showSnackbar({
        message: 'タスクを削除しました',
        type: 'success',
      });
      mutate?.();
    },
    [showSnackbar, mutate]
  );

  return { deleteTodo, isSubmitting };
};
