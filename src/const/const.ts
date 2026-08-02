export const LOCAL_STORAGE_TOKEN_KEY =
  'todo-frontend-react-local-storage-auth-jwt-token-key' as const;

/** タスクの入力文字数上限（バックエンドのバリデーションに合わせる） */
export const TASK_MAX_LENGTH = {
  title: 50,
  description: 300,
} as const;
