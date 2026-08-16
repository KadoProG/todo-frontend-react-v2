import type { ChangeEvent, FC } from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/common/button/Button';
import { Avatar } from '@/components/common/dataDisplay/Avatar';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import type { components } from '@/lib/apiClient/types/schema';
import { useUserIconUpdate } from '@/pages/profile/hooks/useUserIconUpdate';

/** サーバ側の `mimes:jpeg,png,webp` に合わせる */
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
/** サーバ側の `max:2048`（KB 単位）に合わせる */
const MAX_FILE_SIZE = 2048 * 1024;

type IconUploaderProps = {
  user: components['schemas']['UserResource'];
  /** 更新後に AuthContext を再取得させる */
  mutate?: () => void;
};

export const IconUploader: FC<IconUploaderProps> = ({ user, mutate }) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const { uploadIcon, deleteIcon, isSubmitting } = useUserIconUpdate({ mutate });
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<{ file: File; previewUrl: string } | null>(null);

  // 選択を切り替えたときとアンマウント時に、生成した Object URL を解放する
  useEffect(() => {
    if (!selected) {
      return;
    }
    return () => URL.revokeObjectURL(selected.previewUrl);
  }, [selected]);

  const clearSelection = useCallback(() => {
    setSelected(null);
    // 同じファイルを選び直したときにも change が発火するようリセットする
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) {
        clearSelection();
        return;
      }
      // サーバの 422 と二重の防御。ここで弾いておくと無駄な通信をせずに済む
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        showSnackbar({ message: 'JPEG / PNG / WebP の画像を選択してください', type: 'warning' });
        clearSelection();
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showSnackbar({ message: '画像は 2MB 以内のものを選択してください', type: 'warning' });
        clearSelection();
        return;
      }
      setSelected({ file, previewUrl: URL.createObjectURL(file) });
    },
    [clearSelection, showSnackbar]
  );

  const handleUpload = useCallback(async () => {
    if (!selected) {
      return;
    }
    const success = await uploadIcon(user.id, selected.file);
    if (success) {
      // 保存後は AuthContext 経由で新しい icon_url が流れてくるため、プレビューは破棄する
      clearSelection();
    }
  }, [selected, uploadIcon, user.id, clearSelection]);

  const handleDelete = useCallback(async () => {
    await deleteIcon(user.id);
  }, [deleteIcon, user.id]);

  return (
    <div className="flex flex-col gap-2">
      <span>アイコン</span>
      <div className="flex items-center gap-4">
        <Avatar iconUrl={selected?.previewUrl ?? user.icon_url} name={user.name} size={96} />
        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_MIME_TYPES.join(',')}
            disabled={isSubmitting}
            onChange={handleChange}
            aria-label="アイコン画像を選択"
            className="max-w-full text-sm"
          />
          <div className="flex gap-2">
            <Button type="button" onClick={handleUpload} disabled={isSubmitting || !selected}>
              保存
            </Button>
            {selected && (
              <Button type="button" onClick={clearSelection} disabled={isSubmitting}>
                取り消し
              </Button>
            )}
            {user.icon_url && (
              <Button type="button" onClick={handleDelete} disabled={isSubmitting}>
                削除
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
