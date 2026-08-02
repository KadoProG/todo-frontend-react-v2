import type { FC } from 'react';
import { Link } from 'react-router';

import { ThemeSwitch } from '@/components/AppLayout/SideBar/ThemeSwitch';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { useTodoList } from '@/pages/todo/hooks/useTodoList';

export const SideBar: FC = () => {
  const { isLoading, todos } = useTodoList();

  return (
    <div className="w-[140px] rounded border border-border p-2 dark:border-border-dark">
      <ThemeSwitch />
      <div className="mb-2">
        <Link to="/profile">プロフィール</Link>
      </div>
      <p>ToDo</p>
      <div className="flex flex-col gap-2">
        {isLoading && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
        {todos.map((todo) => (
          <div key={todo.id} className="min-w-0">
            <div className="flex gap-1">
              <Link
                to={`/todo/${todo.id}`}
                title={todo.title}
                className="block min-w-0 flex-1 truncate"
              >
                {todo.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
