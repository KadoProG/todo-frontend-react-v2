import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/input/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';

type TaskEditFormProps = {
  task: {
    title: string;
    description: string | null;
  };
  onSubmit: (data: { title: string; description: string }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
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
  }>({
    defaultValues: {
      title: task.title || '',
      description: task.description || '',
    },
  });

  // タスクデータが変更されたらフォームの値を更新
  React.useEffect(() => {
    reset({
      title: task.title || '',
      description: task.description || '',
    });
  }, [task, reset]);

  const handleFormSubmit = React.useCallback(
    async (formData: { title: string; description: string }) => {
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
    });
    onCancel();
  }, [task, reset, onCancel]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2">
      <TextField control={control} name="title" label="タイトル" required disabled={isSubmitting} />
      <TextField control={control} name="description" label="説明" disabled={isSubmitting} />
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
