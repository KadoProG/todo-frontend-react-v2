import { Button } from '@/components/common/button/Button';
import { DeleteButton } from '@/components/common/button/DeleteButton';
import dayjs from 'dayjs';
import React from 'react';

type TaskDisplayProps = {
  task: {
    title: string;
    description: string | null;
    is_done: boolean;
    expired_at: string | null;
    assigned_users?: { id: number; name: string; email: string }[];
  };
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
    </div>
  );
};
