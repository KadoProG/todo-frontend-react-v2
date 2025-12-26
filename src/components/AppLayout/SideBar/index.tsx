import React from 'react';
import { Link } from 'react-router-dom';

import { ThemeSwitch } from '@/components/AppLayout/SideBar/ThemeSwitch';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { useTodoList } from '@/pages/todo/hooks/useTodoList';

export const SideBar: React.FC = () => {
  const { isLoading, todos } = useTodoList();

  return (
    <div className="w-[140px] rounded border border-border p-2 dark:border-border-dark">
      <ThemeSwitch />
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
          <div key={todo.id}>
            <div className="flex gap-1">
              <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
