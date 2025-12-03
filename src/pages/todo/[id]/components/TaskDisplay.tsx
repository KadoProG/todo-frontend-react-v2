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
    <>
      <div className="flex items-center gap-2">
        <p>タイトル：{task.title}</p>
        <Button onClick={onEdit} disabled={isSubmitting}>
          編集
        </Button>
      </div>
      <p>
        <small>説明：{task.description}</small>
      </p>
      <p>状態：{task.is_done ? '完了' : '未完了'}</p>
    </>
  );
};
