import { useSnackbarContext } from '@/components/common/feedback/snackbarContext';
import { apiClient } from '@/lib/apiClient';
import { useCallback, useState } from 'react';

export const useEditTaskAction = (mutate: () => void) => {
  const { showSnackbar } = useSnackbarContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editTaskAction = useCallback(
    async ({
      id,
      taskId,
      name,
      isDone,
    }: {
      id: number;
      taskId: number;
      name?: string;
      isDone?: boolean;
    }) => {
      if (name === undefined && isDone === undefined) return;

      setIsSubmitting(true);
      const res = await apiClient.PUT('/v1/tasks/{task}/actions/{action}', {
        params: {
          path: {
            task: taskId,
            action: id,
          },
        },
        body: {
          name,
          is_done: isDone,
        },
      });
      setIsSubmitting(false);
      if (!res.response.ok) {
        showSnackbar({ message: '失敗', type: 'error' });
        return;
      }
      showSnackbar({ message: 'アクションを更新しました', type: 'success' });
      mutate();
    },
    [mutate, showSnackbar]
  );

  return { editTaskAction, isSubmitting };
};
