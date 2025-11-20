import { Button } from '@/components/common/button/Button';
import React from 'react';

export const HomePage: React.FC = () => (
  <div className="p-2">
    <h1>Home Page</h1>
    <p>ホームページです</p>
    <div className="flex flex-col gap-2">
      <Button href="/todo">ToDoリスト</Button>
      <Button href="/login">ログイン</Button>
      <Button href="/register">登録</Button>
    </div>
  </div>
);
