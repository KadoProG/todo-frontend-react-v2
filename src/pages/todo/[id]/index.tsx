import { AppLayout } from '@/components/AppLayout';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { apiClient } from '@/lib/apiClient';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useTaskActions } from '@/pages/todo/[id]/lib/useTaskActions';
import { useAddTaskAction } from '@/pages/todo/[id]/lib/useAddTaskAction';
import { useEditTaskAction } from '@/pages/todo/[id]/lib/useEditTaskAction';
import { Button } from '@/components/common/button/Button';
import { useTodoUpdate } from '@/pages/todo/lib/useTodoUpdate';
import { useTodoDelete } from '@/pages/todo/lib/useTodoDelete';
import { TaskEditForm } from '@/pages/todo/[id]/components/TaskEditForm';
import { TaskDisplay } from '@/pages/todo/[id]/components/TaskDisplay';
import { DialogBase } from '@/components/Feedback/DialogBase';
import { DialogHeader } from '@/components/common/feedback/DialogHeader';
import { DialogContent } from '@/components/common/feedback/DialogContent';
import { DialogActions } from '@/components/common/feedback/DialogActions';

export const TodoDetailPage: React.FC = () => {
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { actions, isLoading: isActionsLoading, mutate } = useTaskActions(id);
  const { addTaskAction, isSubmitting: isAddTaskSubmitting } = useAddTaskAction(id, mutate);
  const { editTaskAction, isSubmitting: isEditTaskSubmitting } = useEditTaskAction(mutate);
  const isSubmitting = isAddTaskSubmitting || isEditTaskSubmitting;

  const params = id
    ? {
        task: id,
        url: '/v1/tasks/{task}',
      }
    : null;

  const {
    data,
    isLoading,
    mutate: mutateTask,
  } = useSWR(
    params,
    (params) =>
      apiClient.GET('/v1/tasks/{task}', {
        params: {
          path: {
            task: Number(params.task),
          },
        },
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error) => {
        console.error(error);
        setIsNotFound(true);
      },
    }
  );

  const task = data?.data?.task;
  const { updateTodo, isSubmitting: isUpdateSubmitting } = useTodoUpdate({ mutate: mutateTask });
  const { deleteTodo, isSubmitting: isDeleteSubmitting } = useTodoDelete({
    mutate: mutateTask,
  });

  const handleSubmit = React.useCallback(
    async (formData: {
      title: string;
      description: string;
      expired_at: string;
      assigned_user_ids: number[];
    }) => {
      if (!id || !task) return false;
      const success = await updateTodo(Number(id), {
        title: formData.title,
        description: formData.description,
        expired_at: formData.expired_at || undefined,
        assigned_user_ids: formData.assigned_user_ids,
      });
      if (success) {
        setIsEditing(false);
        return true;
      }
      return false;
    },
    [id, task, updateTodo]
  );

  const handleCancel = React.useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDeleteClick = React.useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!id) return;
    const success = await deleteTodo(Number(id));
    if (success) {
      setIsDeleteDialogOpen(false);
      navigate('/todo');
    }
  }, [id, deleteTodo, navigate]);

  const handleDeleteCancel = React.useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  return (
    <AppLayout>
      <h1>Todo Detail</h1>
      <div className="flex flex-col gap-2 p-2">
        {isLoading && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
        {task &&
          (!isEditing ? (
            <TaskDisplay
              task={task}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeleteClick}
              isSubmitting={isUpdateSubmitting || isDeleteSubmitting}
            />
          ) : (
            <TaskEditForm
              task={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isUpdateSubmitting}
            />
          ))}
        <h3>アクション</h3>
        <div>
          <Button onClick={addTaskAction} disabled={isSubmitting}>
            アクション追加
          </Button>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {isActionsLoading && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
          <div>
            {actions?.map((action) => (
              <div key={action.id}>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={action.is_done}
                    disabled={isSubmitting}
                    onChange={() => {
                      editTaskAction({
                        id: action.id,
                        taskId: action.task_id,
                        isDone: !action.is_done,
                      });
                    }}
                  />
                  <p>
                    {action.name} - {action.is_done ? '完了' : '未完了'}
                  </p>
                </label>
              </div>
            ))}
          </div>
        </div>
        {
          // 一つもTodoが見つからなかった場合
          isNotFound && <p>Not Found</p>
        }
      </div>
      <Link to="/todo">前のページに戻る</Link>
      <DialogBase isOpen={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogHeader title="タスクの削除" onClose={handleDeleteCancel} />
        <DialogContent>
          <p>このタスクを削除してもよろしいですか？</p>
          <p>この操作は取り消せません。</p>
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
