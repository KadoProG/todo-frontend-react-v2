import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { useTodoDelete } from '@/pages/todo/lib/useTodoDelete';
import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    DELETE: vi.fn(),
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

describe('useTodoDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常に削除できる', async () => {
    const mockMutate = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.DELETE.mockResolvedValue({ response: { ok: true } } as any);
    const { result } = renderHook(() => useTodoDelete({ mutate: mockMutate }), {
      wrapper: TestWrapper,
    });
    await act(async () => {
      await result.current.deleteTodo(1);
    });
    expect(mockApiClient.DELETE).toHaveBeenCalledWith('/v1/tasks/{task}', {
      params: { path: { task: 1 } },
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクを削除しました',
      type: 'success',
    });
    expect(mockMutate).toHaveBeenCalled();
  });

  it('削除失敗時はエラースナックバー', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.DELETE.mockResolvedValue({ response: { ok: false } } as any);
    const { result } = renderHook(() => useTodoDelete({}), { wrapper: TestWrapper });
    await act(async () => {
      await result.current.deleteTodo(2);
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクの削除に失敗しました',
      type: 'error',
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクを削除しました',
      type: 'success',
    });
  });

  it('例外時もエラースナックバー', async () => {
    mockApiClient.DELETE.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useTodoDelete({}), { wrapper: TestWrapper });
    await act(async () => {
      await result.current.deleteTodo(3);
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクの削除に失敗しました',
      type: 'error',
    });
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'タスクを削除しました',
      type: 'success',
    });
  });

  it('isSubmittingの状態が正しく変化する', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolvePromise: (v: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promise = new Promise<any>((resolve) => {
      resolvePromise = resolve;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockApiClient.DELETE.mockReturnValue(promise as any);
    const { result } = renderHook(() => useTodoDelete({}), { wrapper: TestWrapper });
    expect(result.current.isSubmitting).toBe(false);
    act(() => {
      result.current.deleteTodo(4);
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
});
