import { Select } from '@/components/common/input/Select';
import { TextField } from '@/components/common/input/TextField';
import { DialogBase } from '@/components/Feedback/DialogBase';
import { useTodoCreate } from '@/pages/todo/lib/useTodoCreate';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  isOpen: boolean;
  onClose: (isMutate?: boolean) => void;
};

export const AddTodoDialog: FC<Props> = ({ isOpen, onClose }) => {
  const { control, reset, handleSubmit } = useForm<{
    title: string;
    description: string;
    is_done: boolean;
    publicStatus: 'private' | 'public';
    expired_at: string;
  }>({
    defaultValues: {
      title: '',
      description: '',
      is_done: false,
      publicStatus: 'private',
      expired_at: '',
    },
  });
  const { createTodo, isSubmitting } = useTodoCreate({
    mutate: () => {
      reset();
      onClose(true);
    },
  });
  const onSubmit = useCallback(async () => {
    handleSubmit(async (data) => {
      await createTodo({
        title: data.title,
        description: data.description,
        is_done: false,
        is_public: data.publicStatus === 'public',
        expired_at: data.expired_at,
      });
    })();
  }, [createTodo, handleSubmit]);

  return (
    <DialogBase isOpen={isOpen} onClose={onClose}>
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <h2 className="mb-2 text-2xl font-bold">タスク追加</h2>
        <TextField
          control={control}
          name="title"
          label="タスク名"
          required
          disabled={isSubmitting}
        />
        <TextField
          control={control}
          name="description"
          label="タスクの説明"
          disabled={isSubmitting}
        />
        <Select
          label="公開範囲"
          options={[
            { label: '非公開', value: 'private' },
            { label: '公開', value: 'public' },
          ]}
          control={control}
          name="publicStatus"
          disabled={isSubmitting}
        />
        <TextField
          control={control}
          name="expired_at"
          type="datetime-local"
          label="期限"
          disabled={isSubmitting}
        />
        {/* <FormSelect
          label="担当者"
          options={users
            .filter((user) => user.role !== 'admin')
            .map((user) => ({ label: user.name, value: String(user.id) }))}
          value={assignedUserId}
          setValue={(value) => {
            setAssignedUserId(value);
            setErrorMessage(null);
          }}
          showOptionNotSelected="selectable"
          disabled={isSubmitting}
        /> */}
        <div /> {/* デザイン用 */}
        <button
          className="cursor-pointer rounded-xl bg-bg-active p-3 hover:bg-bg-active-hover dark:bg-bg-active-dark dark:hover:bg-bg-active-hover-dark"
          type="submit"
          disabled={isSubmitting}
        >
          追加する
        </button>
      </form>
    </DialogBase>
  );
};
