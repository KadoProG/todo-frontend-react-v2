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

export const TodoDetailPage: React.FC = () => {
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false);
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

  const { data, isLoading } = useSWR(
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
        {task && (
          <>
            <p>タイトル：{task.title}</p>
            <p>
              <small>説明：{task.description}</small>
            </p>
            <p>状態：{task.is_done ? '完了' : '未完了'}</p>
          </>
        )}
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
