import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { useTodoCreate } from '@/pages/todo/hooks/useTodoCreate';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';

// apiClientのモック
vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    POST: vi.fn(),
  },
}));
const mockApiClient = vi.mocked(apiClient);

// SnackbarContextのモック
const mockShowSnackbar = vi.fn();
const mockSnackbarContextValue = {
  showSnackbar: mockShowSnackbar,
};

// テスト用のラッパー
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SnackbarContext.Provider value={mockSnackbarContextValue}>{children}</SnackbarContext.Provider>
);

describe('useTodoCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常にタスク作成できる', async () => {
    const mockMutate = vi.fn();
    mockApiClient.POST.mockResolvedValue({
      response: { ok: true },
      data: { task: { id: 1, title: 'テスト' } },
    });

    const { result } = renderHook(() => useTodoCreate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });
    await act(async () => {
      const ok = await result.current.createTodo({ title: 'テスト', is_public: true });
      expect(ok).toBe(true);
    });

    expect(mockApiClient.POST).toHaveBeenCalled();
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクを作成しました',
      type: 'success',
    });
    expect(mockMutate).toHaveBeenCalled();
  });

  it('expired_atとassigned_user_idsが設定されている場合、正しく送信される', async () => {
    const mockMutate = vi.fn();
    mockApiClient.POST.mockResolvedValue({
      response: { ok: true },
      data: { task: { id: 1, title: 'テスト' } },
    });

    const { result } = renderHook(() => useTodoCreate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });
    await act(async () => {
      const ok = await result.current.createTodo({
        title: 'テスト',
        is_public: true,
        expired_at: '2024-12-31T23:59:59',
        assigned_user_ids: [1, 2, 3],
      });
      expect(ok).toBe(true);
    });

    expect(mockApiClient.POST).toHaveBeenCalledWith('/v1/tasks', {
      body: {
        title: 'テスト',
        description: undefined,
        is_done: undefined,
        is_public: true,
        expired_at: new Date('2024-12-31T23:59:59').toISOString(),
        assigned_user_ids: [1, 2, 3],
      },
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクを作成しました',
      type: 'success',
    });
    expect(mockMutate).toHaveBeenCalled();
  });

  it('mutateが渡されていない場合でも正常に動作する', async () => {
    mockApiClient.POST.mockResolvedValue({
      response: { ok: true },
      data: { task: { id: 1, title: 'テスト' } },
    });

    const { result } = renderHook(() => useTodoCreate({}), {
      wrapper: TestWrapper,
    });
    await act(async () => {
      const ok = await result.current.createTodo({ title: 'テスト', is_public: true });
      expect(ok).toBe(true);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクを作成しました',
      type: 'success',
    });
  });

  it('422エラー時は警告スナックバー', async () => {
    mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 422 } });
    const { result } = renderHook(() => useTodoCreate({}), { wrapper: TestWrapper });
    await act(async () => {
      const ok = await result.current.createTodo({ title: 'bad', is_public: true });
      expect(ok).toBe(false);
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: '入力内容に誤りがあります。',
      type: 'warning',
    });
  });

  it('401エラー時は適切に処理される', async () => {
    const mockMutate = vi.fn();
    mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 401 } });
    const { result } = renderHook(() => useTodoCreate({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });
    await act(async () => {
      const ok = await result.current.createTodo({ title: 'bad', is_public: true });
      expect(ok).toBe(false);
    });
    expect(mockShowSnackbar).not.toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('403エラー時は権限エラー', async () => {
    mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 403 } });
    const { result } = renderHook(() => useTodoCreate({}), { wrapper: TestWrapper });
    await act(async () => {
      const ok = await result.current.createTodo({ title: 'bad', is_public: true });
      expect(ok).toBe(false);
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({ message: '権限がありません。', type: 'error' });
  });

  it('その他エラー時は汎用エラー', async () => {
    mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 500 } });
    const { result } = renderHook(() => useTodoCreate({}), { wrapper: TestWrapper });
    await act(async () => {
      const ok = await result.current.createTodo({ title: 'bad', is_public: true });
      expect(ok).toBe(false);
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'エラーが発生しました。',
      type: 'error',
    });
  });

  it('例外時も汎用エラー', async () => {
    mockApiClient.POST.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useTodoCreate({}), { wrapper: TestWrapper });
    await act(async () => {
      await result.current.createTodo({ title: 'bad', is_public: true });
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'エラーが発生しました。',
      type: 'error',
    });
  });

  it('isSubmittingの状態が正しく変化する', async () => {
    mockApiClient.POST.mockResolvedValue({ response: { ok: true }, data: {} });
    const { result } = renderHook(() => useTodoCreate({}), { wrapper: TestWrapper });
    expect(result.current.isSubmitting).toBe(false);

    let resolvePromise: (v: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockApiClient.POST.mockReturnValue(promise);

    act(() => {
      result.current.createTodo({ title: 'a', is_public: true });
    });

    // isSubmittingがtrueになるのを待つ
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    // Promiseを解決して完了させる
    act(() => {
      resolvePromise!({ response: { ok: true }, data: {} });
    });

    // isSubmittingがfalseに戻るのを待つ
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
