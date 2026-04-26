import type { FC, FormEvent } from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/common/button/Button';
import { TextField } from '@/components/common/input/TextField';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { AuthContext } from '@/contexts/auth';
import { useUserUpdate } from '@/pages/profile/hooks/useUserUpdate';

type ProfileForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const ProfilePage: FC = () => {
  const { user, mutate: authMutate } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const { updateUser, isSubmitting } = useUserUpdate({ mutate: authMutate });
  const [changePassword, setChangePassword] = useState(false);

  const { control, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
      });
    }
  }, [user, reset]);

  const submitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user) {
        return;
      }
      handleSubmit(async (formData) => {
        if (changePassword) {
          if (formData.password !== formData.password_confirmation) {
            showSnackbar({ message: 'パスワードが一致しません', type: 'warning' });
            return;
          }
        }
        await updateUser(user.id, {
          name: formData.name,
          email: formData.email,
          ...(changePassword
            ? {
                password: formData.password,
                password_confirmation: formData.password_confirmation,
              }
            : {}),
        });
      })();
    },
    [user, handleSubmit, changePassword, showSnackbar, updateUser]
  );

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 px-4 py-2">
        <h1 className="text-3xl">プロフィール</h1>
        <form onSubmit={submitForm} className="flex max-w-md flex-col gap-2">
          <TextField
            control={control}
            name="name"
            label="名前"
            type="text"
            required
            disabled={isSubmitting}
          />
          <TextField
            control={control}
            name="email"
            label="メールアドレス"
            type="email"
            required
            disabled={isSubmitting}
          />
          <label className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={changePassword}
              disabled={isSubmitting}
              onChange={(e) => {
                setChangePassword(e.target.checked);
                if (!e.target.checked) {
                  reset(
                    (values) => ({
                      ...values,
                      password: '',
                      password_confirmation: '',
                    }),
                    { keepDefaultValues: true }
                  );
                }
              }}
            />
            <span>パスワードを変更する</span>
          </label>
          <TextField
            control={control}
            name="password"
            label="新しいパスワード"
            type="password"
            required={changePassword}
            disabled={isSubmitting || !changePassword}
          />
          <TextField
            control={control}
            name="password_confirmation"
            label="新しいパスワード（確認）"
            type="password"
            required={changePassword}
            disabled={isSubmitting || !changePassword}
          />
          <div>
            <Button type="submit" disabled={isSubmitting}>
              保存
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
