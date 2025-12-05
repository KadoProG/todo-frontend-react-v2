import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { useTodoUpdate } from '@/pages/todo/lib/useTodoUpdate';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    PUT: vi.fn(),
  },
}));
const mockApiClient = vi.mocked(apiClient);

const mockShowSnackbar = vi.fn();
const mockSnackbarContextValue = {
  showSnackbar: mockShowSnackbar,
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SnackbarContext.Provider value={mockSnackbarContextValue}>{children}</SnackbarContext.Provider>
);

describe('useTodoUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常に更新できる', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
      description: '更新された説明',
      is_done: true,
      is_public: false,
      expired_at: '2024-12-31T23:59:59',
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(true);
    });

    expect(mockApiClient.PUT).toHaveBeenCalledWith('/v1/tasks/{task}', {
      params: { path: { task: 1 } },
      body: {
        title: '更新されたタスク',
        description: '更新された説明',
        is_done: true,
        is_public: false,
        expired_at: new Date('2024-12-31T23:59:59').toISOString(),
        assigned_user_ids: [],
      },
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: '内容を更新しました',
      type: 'success',
    });
    expect(mockMutate).toHaveBeenCalled();
  });

  it('expired_atがnullの場合、nullとして送信される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
      expired_at: undefined,
    };

    await act(async () => {
      await result.current.updateTodo(1, updateData);
    });

    expect(mockApiClient.PUT).toHaveBeenCalledWith('/v1/tasks/{task}', {
      params: { path: { task: 1 } },
      body: {
        title: '更新されたタスク',
        description: undefined,
        is_done: undefined,
        is_public: undefined,
        expired_at: null,
        assigned_user_ids: [],
      },
    });
  });

  it('assigned_user_idsが配列で渡された場合、その配列が送信される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
      assigned_user_ids: [1, 2, 3],
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(true);
    });

    expect(mockApiClient.PUT).toHaveBeenCalledWith('/v1/tasks/{task}', {
      params: { path: { task: 1 } },
      body: {
        title: '更新されたタスク',
        description: undefined,
        is_done: undefined,
        is_public: undefined,
        expired_at: null,
        assigned_user_ids: [1, 2, 3],
      },
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: '内容を更新しました',
      type: 'success',
    });
    expect(mockMutate).toHaveBeenCalled();
  });

  it('mutateが渡されていない場合でも正常に動作する', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useTodoUpdate({}), { wrapper: TestWrapper });

    const updateData = {
      title: '更新されたタスク',
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(true);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: '内容を更新しました',
      type: 'success',
    });
  });

  it('401エラーの場合、適切なメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 401 } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).not.toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('422エラーの場合、バリデーションエラーメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 422 } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: '入力内容に誤りがあります。',
      type: 'warning',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('403エラーの場合、権限エラーメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 403 } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({ message: '権限がありません。', type: 'error' });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('その他のエラーの場合、汎用エラーメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 500 } } as any);
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
    };

    await act(async () => {
      const success = await result.current.updateTodo(1, updateData);
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'エラーが発生しました。',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('例外が発生した場合、エラーメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockApiClient.PUT.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    const updateData = {
      title: '更新されたタスク',
    };

    await act(async () => {
      await result.current.updateTodo(1, updateData);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'エラーが発生しました。',
      type: 'error',
    });
    expect(consoleSpy).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('isSubmittingの状態が正しく変化する', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolvePromise: (v: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promise = new Promise<any>((resolve) => {
      resolvePromise = resolve;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockReturnValue(promise as any);
    const { result } = renderHook(() => useTodoUpdate({}), { wrapper: TestWrapper });

    expect(result.current.isSubmitting).toBe(false);

    const updateData = {
      title: '更新されたタスク',
    };

    act(() => {
      result.current.updateTodo(1, updateData);
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    act(() => {
      resolvePromise!({ response: { ok: true } });
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('戻り値が正しい', () => {
    const mockMutate = vi.fn();
    const { result } = renderHook(() => useTodoUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    expect(result.current).toHaveProperty('updateTodo');
    expect(result.current).toHaveProperty('isSubmitting');
    expect(result.current).toHaveProperty('showSnackbar');

    expect(typeof result.current.updateTodo).toBe('function');
    expect(typeof result.current.isSubmitting).toBe('boolean');
    expect(typeof result.current.showSnackbar).toBe('function');
  });
});
