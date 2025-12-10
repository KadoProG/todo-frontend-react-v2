import { Button } from '@/components/common/button/Button';
import { DeleteButton } from '@/components/common/button/DeleteButton';
import dayjs from 'dayjs';
import React from 'react';
import type { components } from '@/lib/apiClient/types/schema';

type TaskDisplayProps = {
  task: Pick<
    components['schemas']['TaskResource'],
    'title' | 'description' | 'is_done' | 'expired_at' | 'assigned_users' | 'created_user'
  >;
  onEdit: () => void;
  onDelete: () => void;
  isSubmitting?: boolean;
};

export const TaskDisplay: React.FC<TaskDisplayProps> = ({
  task,
  onEdit,
  onDelete,
  isSubmitting = false,
}) => {
  return (
    <div className="relative border border-border p-2 dark:border-border-dark">
      <p className="text-lg font-bold">{task.title}</p>
      <div className="absolute top-2 right-2 flex gap-2">
        <Button onClick={onEdit} disabled={isSubmitting}>
          編集
        </Button>
        <DeleteButton onClick={onDelete} disabled={isSubmitting} />
      </div>
      <p>説明：{task.description}</p>
      <p>状態：{task.is_done ? '完了' : '未完了'}</p>
      <p>
        期限：{task.expired_at ? dayjs(task.expired_at).format('YYYY年MM月DD日 HH:mm') : 'なし'}
      </p>
      <p>
        担当者：
        {task.assigned_users && task.assigned_users.length > 0
          ? task.assigned_users.map((user) => user.name).join(', ')
          : 'なし'}
      </p>
      <p>作成者：{task.created_user.name}</p>
    </div>
  );
};
