import { Skeleton } from '@/components/common/feedback/Skeleton';
import { useTodoList } from '@/pages/todo/useTodoList';
import React from 'react';
import { Link } from 'react-router-dom';

export const SideBar: React.FC = () => {
  const { isLoading, todos } = useTodoList();

  return (
    <div style={{ width: 140, padding: 8, border: '1px solid var(--divider)', borderRadius: 4 }}>
      <p>ToDo</p>
      <div style={{ display: 'flex', flexFlow: 'column', gap: 8 }}>
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
            <div style={{ display: 'flex', gap: 4 }}>
              <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
            </div>
            <div style={{ paddingLeft: 8 }}>
              {todo.children?.map((child) => (
                <div key={child.id} style={{ display: 'flex', gap: 4 }}>
                  <Link to={`/todo/${child.id}`}>{child.title}</Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
