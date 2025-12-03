import { AppLayout } from '@/components/AppLayout';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { apiClient } from '@/lib/apiClient';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useTaskActions } from '@/pages/todo/[id]/lib/useTaskActions';
import { useAddTaskAction } from '@/pages/todo/[id]/lib/useAddTaskAction';
import { useEditTaskAction } from '@/pages/todo/[id]/lib/useEditTaskAction';
import { Button } from '@/components/common/button/Button';
import { useTodoUpdate } from '@/pages/todo/lib/useTodoUpdate';
import { TaskEditForm } from '@/pages/todo/[id]/components/TaskEditForm';
import { TaskDisplay } from '@/pages/todo/[id]/components/TaskDisplay';

export const TodoDetailPage: React.FC = () => {
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
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

  const handleSubmit = React.useCallback(
    async (formData: { title: string; description: string }) => {
      if (!id || !task) return false;
      const success = await updateTodo(Number(id), {
        title: formData.title,
        description: formData.description,
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

  return (
    <AppLayout>
      <h1>Todo Detail</h1>
      <div style={{ display: 'flex', flexFlow: 'column', gap: 8, padding: 8 }}>
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
              isSubmitting={isUpdateSubmitting}
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
        <div style={{ display: 'flex', flexFlow: 'column', gap: 8, padding: 8 }}>
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
                <label style={{ display: 'flex', gap: 8 }}>
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
    </AppLayout>
  );
};
