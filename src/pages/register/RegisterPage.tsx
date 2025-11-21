import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/input/TextField';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { AuthContext } from '@/contexts/auth';
import { apiClient } from '@/lib/apiClient';
import { store } from '@/lib/store';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const { mutate } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<{
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const submitForm = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit(async (formData) => {
        try {
          // パスワード確認のバリデーション
          if (formData.password !== formData.password_confirmation) {
            showSnackbar({ message: 'パスワードが一致しません', type: 'warning' });
            return;
          }

          const response = await apiClient.POST('/v1/register', {
            body: {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              password_confirmation: formData.password_confirmation,
            },
          });
          if (!response.response.ok) {
            throw new Error('登録に失敗しました');
          }
          if (!response.data) {
            throw new Error('予期せぬレスポンスエラー');
          }
          // レスポンスはtoken文字列
          store.set('token', response.data);
          mutate();
          showSnackbar({ message: '登録が完了しました', type: 'success' });
          navigate('/todo');
        } catch (error) {
          showSnackbar({ message: '登録に失敗しました', type: 'warning' });
          console.error(error);
        }
      })();
    },
    [handleSubmit, showSnackbar, mutate, navigate]
  );

  return (
    <div>
      <h1>Register Page</h1>
      <form
        onSubmit={submitForm}
        style={{
          padding: 8,
          margin: 8,
        }}
      >
        <TextField control={control} name="name" label="名前" type="text" required />
        <TextField control={control} name="email" label="メールアドレス" type="email" required />
        <TextField control={control} name="password" label="パスワード" type="password" required />
        <TextField
          control={control}
          name="password_confirmation"
          label="パスワード（確認）"
          type="password"
          required
        />
        <Button>登録</Button>
      </form>
    </div>
  );
};
