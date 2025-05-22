import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/common/button/Button';
import { DeleteButton } from '@/components/common/button/DeleteButton';
import { Skeleton } from '@/components/common/feedback/Skeleton';
import { TextField } from '@/components/common/input/TextField';
import { useTodoDelete } from '@/pages/todo/lib/useTodoDelete';
import { useTodoUpdate } from '@/pages/todo/lib/useTodoUpdate';
import { useTodoList } from '@/pages/todo/useTodoList';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

export const TodoPage: React.FC = () => {
  const { control, isLoading, isHandleLoading, todos, handleAddTodo, mutate } = useTodoList();
  const { updateTodo, isSubmitting: isUpdateSubmitting } = useTodoUpdate({ mutate });
  const { deleteTodo, isSubmitting: isDeleteSubmitting } = useTodoDelete({ mutate });

  const disabled = isHandleLoading || isUpdateSubmitting || isDeleteSubmitting;

  return (
    <AppLayout>
      <div style={{ padding: 8 }}>
        <h1 className="text-3xl">ToDo App</h1>
        <div style={{ display: 'flex', width: '100%' }}>
          <div>
            <TextField
              control={control}
              name="title"
              placeholder="Add new todo"
              required
              type="text"
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleAddTodo} disabled={isHandleLoading}>
              Add
            </Button>
          </div>
        </div>
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
              <div style={{ border: '1px solid var(--divider)', padding: 8 }}>
                <p>
                  <Link to={`/todo/${todo.id}`}>{todo.title}</Link>
                </p>
                <p>
                  <small>{todo.description}</small>
                </p>
                <p>ステータス：{todo.is_done ? '完了' : '未完了'}</p>
                {!todo.is_public && <p style={{ color: 'blue' }}>プライベートタスク</p>}
                {todo.is_public && <p style={{ color: 'green' }}>公開タスク</p>}
                <p>
                  期限：
                  {todo.expired_at ? dayjs(todo.expired_at).format('YYYY年MM月DD日 HH:mm') : 'なし'}
                </p>
                {todo.assigned_users.length !== 0 && (
                  <p>
                    担当者：{todo.assigned_users?.map((assinedUser) => assinedUser.name).join(',')}
                  </p>
                )}
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  <Button
                    onClick={() => updateTodo(todo.id, { is_done: !todo.is_done })}
                    disabled={disabled}
                  >
                    {todo.is_done ? '未完了にする' : '完了にする'}
                  </Button>
                  <DeleteButton onClick={() => deleteTodo(todo.id)} disabled={disabled} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
