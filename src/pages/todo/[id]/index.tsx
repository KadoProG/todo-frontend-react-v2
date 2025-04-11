import { AppLayout } from '@/components/AppLayout';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
import { apiClient } from '@/lib/apiClient';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useTaskActions } from '@/pages/todo/[id]/lib/useTaskActions';

export const TodoDetailPage: React.FC = () => {
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false);
  const { id } = useParams();
  const { actions, isLoading: isActionsLoading } = useTaskActions(id);

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
        },
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (error) => {
        // eslint-disable-next-line
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
            {/* TODO アクションを設定する */}
            {/* {task.children?.map((child) => (
              <div key={child.id} style={{ display: 'flex', gap: 4 }}>
                <Link to={`/todo/${child.id}`}>{child.title}</Link>-{' '}
                {child.isDone ? '完了' : '未完了'}
              </div>
            ))} */}
          </>
        )}
        <h3>アクション</h3>
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
                    <input type="checkbox" checked={action.is_done} />
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
