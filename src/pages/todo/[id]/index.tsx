import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/common/button/Button';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { useSnackbarContext } from '@/components/common/feedback/snackbarContext';
import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
import axios from '@/libs/axios';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';

export const TodoDetailPage: React.FC = () => {
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false);
  const { id } = useParams();
  const { showSnackbar } = useSnackbarContext();

  const { data, isLoading, mutate } = useSWR(
    id ? `/api/v1/tasks/${id}` : null,
    async (url) => {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
        },
      });
      return response.data as Todo;
    },
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

  const addChildTask = React.useCallback(async () => {
    try {
      await axios.post(
        '/api/v1/tasks',
        {
          title: '小タスク',
          parentId: Number(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
          },
        }
      );
      mutate();
      showSnackbar({ message: '小タスクを追加しました', type: 'success' });
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      showSnackbar({ message: 'エラーが発生しました', type: 'error' });
    }
  }, [id, mutate, showSnackbar]);

  return (
    <AppLayout>
      <h1>Todo Detail</h1>
      <div style={{ display: 'flex', flexFlow: 'column', gap: 8, padding: 8 }}>
        {isLoading && (
          <>
            <Skeleton />
            <Skeleton />
          </>
        )}
        {data && (
          <>
            <p>Todo ID： {data.title}</p>
            <p>状態：{data.isDone ? '完了' : '未完了'}</p>
            {data.children?.map((child) => (
              <div key={child.id} style={{ display: 'flex', gap: 4 }}>
                <Link to={`/todo/${child.id}`}>{child.title}</Link>-{' '}
                {child.isDone ? '完了' : '未完了'}
              </div>
            ))}
            <div>
              <Button onClick={addChildTask}>小タスクを追加</Button>
            </div>
          </>
        )}
        {
          // 一つもTodoが見つからなかった場合
          isNotFound && <p>Not Found</p>
        }
      </div>
      <Link to="/todo">前のページに戻る</Link>
    </AppLayout>
  );
};
