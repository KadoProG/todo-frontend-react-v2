import { useCallback, useContext, useState } from 'react';

import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';

type UpdateUserData = {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
};

export const useUserUpdate = ({ mutate }: { mutate?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useContext(SnackbarContext);

  const updateUser = useCallback(
    async (userId: number, data: UpdateUserData) => {
      try {
        setIsSubmitting(true);
        const res = await apiClient.PUT('/v1/users/{user}', {
          params: { path: { user: userId } },
          body: {
            name: data.name,
            email: data.email,
            ...(data.password !== undefined
              ? {
                  password: data.password,
                  password_confirmation: data.password_confirmation,
                }
              : {}),
          },
        });
        setIsSubmitting(false);
        if (!res.response.ok) {
          if (res.response.status === 401) {
            // 認証切れ等 — LoginPage パターンに合わせ、Snackbar なし
          } else if (res.response.status === 422) {
            showSnackbar({ message: '入力内容に誤りがあります。', type: 'warning' });
          } else if (res.response.status === 404) {
            showSnackbar({ message: 'ユーザが見つかりません。', type: 'error' });
          } else {
            showSnackbar({ message: 'エラーが発生しました。', type: 'error' });
          }
          return false;
        }
        showSnackbar({ message: 'プロフィールを更新しました', type: 'success' });
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
  return { updateUser, isSubmitting, showSnackbar };
};
