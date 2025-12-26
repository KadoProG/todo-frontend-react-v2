import dayjs from 'dayjs';
import React, { MouseEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/common/button/Button';
import { DeleteButton } from '@/components/common/button/DeleteButton';
import { DialogActions } from '@/components/common/feedback/DialogActions';
import { DialogContent } from '@/components/common/feedback/DialogContent';
import { DialogHeader } from '@/components/common/feedback/DialogHeader';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { DialogBase } from '@/components/Feedback/DialogBase';
import { AddTodoDialog } from '@/pages/todo/components/AddTodoDialog';
import { useTodoDelete } from '@/pages/todo/hooks/useTodoDelete';
import { useTodoList } from '@/pages/todo/hooks/useTodoList';
import { useTodoUpdate } from '@/pages/todo/hooks/useTodoUpdate';

export const TodoPage: React.FC = () => {
  const { isLoading, todos, mutate } = useTodoList();
  const { updateTodo, isSubmitting: isUpdateSubmitting } = useTodoUpdate({ mutate });
  const { deleteTodo, isSubmitting: isDeleteSubmitting } = useTodoDelete({ mutate });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const openAddDialog = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setIsOpen(true);
  }, []);
  const closeAddDialog = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleDeleteClick = useCallback((taskId: number) => {
    setDeleteTargetId(taskId);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteTargetId === null) return;
    await deleteTodo(deleteTargetId);
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  }, [deleteTargetId, deleteTodo]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  }, []);

  const disabled = isUpdateSubmitting || isDeleteSubmitting;

  return (
    <AppLayout>
      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">ToDo App</h1>
          <Button onClick={openAddDialog}>追加</Button>
        </div>

        <div className="flex flex-col gap-2">
          {isLoading && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-[200px]" />
              ))}
            </>
          )}
          {todos.map((todo) => (
            <div key={todo.id}>
              <div className="border border-border p-2 dark:border-border-dark">
                <p>
                  <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
                </p>
                <p>
                  <small>{todo.description}</small>
                </p>
                <p>ステータス：{todo.is_done ? '完了' : '未完了'}</p>
                {!todo.is_public && <p className="text-[blue]">プライベートタスク</p>}
                {todo.is_public && <p className="text-[green]">公開タスク</p>}
                <p>
                  期限：
                  {todo.expired_at ? dayjs(todo.expired_at).format('YYYY年MM月DD日 HH:mm') : 'なし'}
                </p>
                {todo.assigned_users.length !== 0 && (
                  <p>
                    担当者：{todo.assigned_users?.map((assinedUser) => assinedUser.name).join(',')}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateTodo(todo.id, { is_done: !todo.is_done })}
                    disabled={disabled}
                  >
                    {todo.is_done ? '未完了にする' : '完了にする'}
                  </Button>
                  <DeleteButton onClick={() => handleDeleteClick(todo.id)} disabled={disabled} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddTodoDialog
        isOpen={isOpen}
        onClose={(isMutate) => {
          closeAddDialog();
          if (isMutate) mutate();
        }}
      />
      <DialogBase isOpen={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogHeader title="タスクの削除" onClose={handleDeleteCancel} />
        <DialogContent>
          <p>このタスクを削除してもよろしいですか？</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">この操作は取り消せません。</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleteSubmitting}>
            キャンセル
          </Button>
          <Button onClick={handleDeleteConfirm} disabled={isDeleteSubmitting}>
            削除
          </Button>
        </DialogActions>
      </DialogBase>
    </AppLayout>
  );
};
