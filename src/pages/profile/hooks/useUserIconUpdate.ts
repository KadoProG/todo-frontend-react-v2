import { useCallback, useContext, useState } from 'react';

import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';

export const useUserIconUpdate = ({ mutate }: { mutate?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useContext(SnackbarContext);

  const showErrorMessage = useCallback(
    (status: number) => {
      if (status === 401) {
        // 認証切れ等 — LoginPage パターンに合わせ、Snackbar なし
        return;
      }
      if (status === 403) {
        showSnackbar({ message: '他のユーザのアイコンは変更できません。', type: 'error' });
        return;
      }
      if (status === 404) {
        showSnackbar({ message: 'ユーザが見つかりません。', type: 'error' });
        return;
      }
      if (status === 422) {
        showSnackbar({ message: '画像の形式またはサイズが正しくありません。', type: 'warning' });
        return;
      }
      showSnackbar({ message: 'エラーが発生しました。', type: 'error' });
    },
    [showSnackbar]
  );

  const uploadIcon = useCallback(
    async (userId: number, file: File) => {
      try {
        setIsSubmitting(true);
        const body = new FormData();
        body.append('icon', file);

        const res = await apiClient.POST('/v1/users/{user}/icon', {
          params: { path: { user: userId } },
          // multipart の Content-Type は boundary 込みでブラウザが組み立てるため、
          // apiClient の既定ヘッダを null で打ち消す
          headers: { 'Content-Type': null },
          // 生成された型は multipart のフィールド定義だが、実際に送るのは FormData
          body: body as unknown as { icon: string },
        });
        setIsSubmitting(false);
        if (!res.response.ok) {
          showErrorMessage(res.response.status);
          return false;
        }
        showSnackbar({ message: 'アイコンを更新しました', type: 'success' });
        mutate?.();
        return true;
      } catch (e) {
        setIsSubmitting(false);
        console.error(e);
        showSnackbar({ message: 'エラーが発生しました。', type: 'error' });
      }
      setIsSubmitting(false);
    },
    [showErrorMessage, showSnackbar, mutate]
  );

  const deleteIcon = useCallback(
    async (userId: number) => {
      try {
        setIsSubmitting(true);
        const res = await apiClient.DELETE('/v1/users/{user}/icon', {
          params: { path: { user: userId } },
        });
        setIsSubmitting(false);
        if (!res.response.ok) {
          showErrorMessage(res.response.status);
          return false;
        }
        showSnackbar({ message: 'アイコンを削除しました', type: 'success' });
        mutate?.();
        return true;
      } catch (e) {
        setIsSubmitting(false);
        console.error(e);
        showSnackbar({ message: 'エラーが発生しました。', type: 'error' });
      }
      setIsSubmitting(false);
    },
    [showErrorMessage, showSnackbar, mutate]
  );

  return { uploadIcon, deleteIcon, isSubmitting, showSnackbar };
};
