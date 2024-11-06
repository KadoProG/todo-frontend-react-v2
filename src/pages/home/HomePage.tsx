import { Button } from '@/components/common/button/Button';
import React from 'react';

export const HomePage: React.FC = () => (
  <div>
    <h1>Home Page</h1>
    <p>ホームページです</p>
    <Button href="/todo">ToDoリスト</Button>
    <Button href="/login">ログイン</Button>
  </div>
);
