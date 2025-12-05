import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/input/TextField';
import { MultiSelect } from '@/components/common/input/MultiSelect';
import { useUsers } from '@/pages/todo/lib/useUsers';
import { formatDateTimeLocal } from '@/utils';
import React from 'react';
import { useForm } from 'react-hook-form';

type TaskEditFormProps = {
  task: {
    title: string;
    description: string | null;
    expired_at: string | null;
    assigned_users?: { id: number; name: string; email: string }[];
  };
  onSubmit: (data: {
    title: string;
    description: string;
    expired_at: string;
    assigned_user_ids: number[];
  }) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { users, isLoading: isUsersLoading } = useUsers();
  const { control, handleSubmit, reset } = useForm<{
    title: string;
    description: string;
    expired_at: string;
    assigned_user_ids: number[];
  }>({
    defaultValues: {
      title: task.title || '',
      description: task.description || '',
      expired_at: formatDateTimeLocal(task.expired_at),
      assigned_user_ids: task.assigned_users?.map((u) => u.id) || [],
    },
  });

  // タスクデータが変更されたらフォームの値を更新
  React.useEffect(() => {
    reset({
      title: task.title || '',
      description: task.description || '',
      expired_at: formatDateTimeLocal(task.expired_at),
      assigned_user_ids: task.assigned_users?.map((u) => u.id) || [],
    });
  }, [task, reset]);

  const handleFormSubmit = React.useCallback(
    async (formData: {
      title: string;
      description: string;
      expired_at: string;
      assigned_user_ids: number[];
    }) => {
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
      assigned_user_ids: task.assigned_users?.map((u) => u.id) || [],
    });
    onCancel();
  }, [task, reset, onCancel]);

  const userOptions = React.useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      label: user.name,
      value: user.id,
    }));
  }, [users]);

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
      {!isUsersLoading && (
        <MultiSelect
          control={control}
          name="assigned_user_ids"
          label="担当者"
          options={userOptions}
          disabled={isSubmitting}
        />
      )}
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
