import { Skeleton } from '@/components/common/feedback/Skeleton';
import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
import axios from '@/libs/axios';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';

export const TodoDetailPage: React.FC = () => {
  const [isNotFound, setIsNotFound] = React.useState<boolean>(false);
  const { id } = useParams();

  const { data, isLoading } = useSWR(
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

  return (
    <div>
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
          </>
        )}
        {
          // 一つもTodoが見つからなかった場合
          isNotFound && <p>Not Found</p>
        }
      </div>
      <Link to="/todo">前のページに戻る</Link>
    </div>
  );
};
