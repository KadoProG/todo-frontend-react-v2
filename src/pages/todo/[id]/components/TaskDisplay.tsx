import { Button } from '@/components/common/button/Button';
import React from 'react';

type TaskDisplayProps = {
  task: {
    title: string;
    description: string | null;
    is_done: boolean;
  };
  onEdit: () => void;
  isSubmitting?: boolean;
};

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ task, onEdit, isSubmitting = false }) => {
  return (
    <div className="relative border border-border p-2 dark:border-border-dark">
      <p className="text-lg font-bold">{task.title}</p>
      <Button onClick={onEdit} disabled={isSubmitting} className="absolute top-2 right-2">
        編集
      </Button>
      <p>説明：{task.description}</p>
      <p>状態：{task.is_done ? '完了' : '未完了'}</p>
    </div>
  );
};
