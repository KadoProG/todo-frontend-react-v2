import { useSnackbarContext } from '@/components/common/feedback/snackbarContext';
import { apiClient } from '@/lib/apiClient';
import { useCallback } from 'react';

export const useAddTaskAction = (id: string | undefined, mutate: () => void) => {
  const { showSnackbar } = useSnackbarContext();
  const add = useCallback(
    async (name: string) => {
      if (!id) return;
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
      if (!res.response.ok) {
        showSnackbar({ message: '失敗', type: 'error' });
        return;
      }
      mutate();
    },
    [id, mutate, showSnackbar]
  );

  return { add };
};
