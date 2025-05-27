import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/input/TextField';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { useAuthContext } from '@/contexts/authContext';
import axios from '@/libs/axios';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';

export const LoginPage: React.FC = () => {
  const { updateToken } = useAuthContext();
  const { showSnackbar } = useContext(SnackbarContext);
  const { control, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submitForm = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit(async (formData) => {
        try {
          const response = await axios.post('/v1/login', formData);
          updateToken(response.data.token);
          showSnackbar({ message: 'ログインしました', type: 'success' });
        } catch (error) {
          showSnackbar({ message: 'ログインに失敗しました', type: 'warning' });
          console.error(error);
        }
      })();
    },
    [handleSubmit, showSnackbar, updateToken]
  );

  return (
    <div>
      <h1>Login Page</h1>
      <form
        onSubmit={submitForm}
        style={{
          padding: 8,
          margin: 8,
        }}
      >
        <TextField control={control} name="email" label="メールアドレス" type="email" required />
        <TextField control={control} name="password" label="パスワード" type="password" required />
        <Button>ログイン</Button>
      </form>
    </div>
  );
};
