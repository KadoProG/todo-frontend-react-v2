import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';
import { useUserUpdate } from '@/pages/profile/hooks/useUserUpdate';

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

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <SnackbarContext.Provider value={mockSnackbarContextValue}>{children}</SnackbarContext.Provider>
);

describe('useUserUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常に更新できる（パスワードなし）', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      const success = await result.current.updateUser(1, {
        name: '新名前',
        email: 'new@example.com',
      });
      expect(success).toBe(true);
    });

    expect(mockApiClient.PUT).toHaveBeenCalledWith('/v1/users/{user}', {
      params: { path: { user: 1 } },
      body: {
        name: '新名前',
        email: 'new@example.com',
      },
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'プロフィールを更新しました',
      type: 'success',
    });
    expect(mockMutate).toHaveBeenCalled();
  });

  it('パスワード付きで更新できる', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      const success = await result.current.updateUser(2, {
        name: 'a',
        email: 'a@a.com',
        password: 'secret1',
        password_confirmation: 'secret1',
      });
      expect(success).toBe(true);
    });

    expect(mockApiClient.PUT).toHaveBeenCalledWith('/v1/users/{user}', {
      params: { path: { user: 2 } },
      body: {
        name: 'a',
        email: 'a@a.com',
        password: 'secret1',
        password_confirmation: 'secret1',
      },
    });
  });

  it('401エラーの場合、Snackbar を出さない', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 401 } } as any);
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      const success = await result.current.updateUser(1, { name: 'n', email: 'e@e.com' });
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).not.toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('422エラーの場合、バリデーションメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 422 } } as any);
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      const success = await result.current.updateUser(1, { name: 'n', email: 'e@e.com' });
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: '入力内容に誤りがあります。',
      type: 'warning',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('404エラーの場合、メッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 404 } } as any);
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      const success = await result.current.updateUser(1, { name: 'n', email: 'e@e.com' });
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'ユーザが見つかりません。',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('500エラーの場合、汎用エラーメッセージが表示される', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.PUT.mockResolvedValue({ response: { ok: false, status: 500 } } as any);
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      const success = await result.current.updateUser(1, { name: 'n', email: 'e@e.com' });
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
    const { result } = renderHook(() => useUserUpdate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.updateUser(1, { name: 'n', email: 'e@e.com' });
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'エラーが発生しました。',
      type: 'error',
    });
    expect(mockMutate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
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
    const { result } = renderHook(() => useUserUpdate({}), { wrapper: TestWrapper });

    expect(result.current.isSubmitting).toBe(false);

    act(() => {
      void result.current.updateUser(1, { name: 'n', email: 'e@e.com' });
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    act(() => {
      if (resolvePromise) {
        resolvePromise({ response: { ok: true } });
      }
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('戻り値のプロパティが揃う', () => {
    const { result } = renderHook(() => useUserUpdate({}), { wrapper: TestWrapper });
    expect(result.current).toHaveProperty('updateUser');
    expect(result.current).toHaveProperty('isSubmitting');
    expect(result.current).toHaveProperty('showSnackbar');
  });
});
