import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/input/TextField';
import dayjs from 'dayjs';
import React from 'react';
import { useForm } from 'react-hook-form';

type TaskEditFormProps = {
  task: {
    title: string;
    description: string | null;
    expired_at: string | null;
  };
  onSubmit: (data: { title: string; description: string; expired_at: string }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

// ISO形式の日時文字列をdatetime-local形式に変換
const formatDateTimeLocal = (isoString: string | null): string => {
  if (!isoString) return '';
  // ISO形式（YYYY-MM-DDTHH:mm:ss.sssZ）をdatetime-local形式（YYYY-MM-DDTHH:mm）に変換
  return dayjs(isoString).format('YYYY-MM-DDTHH:mm');
};

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { control, handleSubmit, reset } = useForm<{
    title: string;
    description: string;
    expired_at: string;
  }>({
    defaultValues: {
      title: task.title || '',
      description: task.description || '',
      expired_at: formatDateTimeLocal(task.expired_at),
    },
  });

  // タスクデータが変更されたらフォームの値を更新
  React.useEffect(() => {
    reset({
      title: task.title || '',
      description: task.description || '',
      expired_at: formatDateTimeLocal(task.expired_at),
    });
  }, [task, reset]);

  const handleFormSubmit = React.useCallback(
    async (formData: { title: string; description: string; expired_at: string }) => {
      const success = await onSubmit(formData);
      if (success) {
        // 成功時は親コンポーネントで編集モードを終了するので、ここでは何もしない
      }
    },
    [onSubmit]
  );

  const handleFormCancel = React.useCallback(() => {
    reset({
      title: task.title || '',
      description: task.description || '',
      expired_at: formatDateTimeLocal(task.expired_at),
    });
    onCancel();
  }, [task, reset, onCancel]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <TextField control={control} name="title" label="タイトル" required disabled={isSubmitting} />
      <TextField control={control} name="description" label="説明" disabled={isSubmitting} />
      <TextField
        control={control}
        name="expired_at"
        type="datetime-local"
        label="期限"
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          保存
        </Button>
        <Button type="button" onClick={handleFormCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
      </div>
    </form>
  );
};
