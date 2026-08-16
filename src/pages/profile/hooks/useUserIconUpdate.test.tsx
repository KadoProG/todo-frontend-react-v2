import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SnackbarContext } from '@/components/Feedback/Snackbar';
import { apiClient } from '@/lib/apiClient';
import { useUserIconUpdate } from '@/pages/profile/hooks/useUserIconUpdate';

vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    POST: vi.fn(),
    DELETE: vi.fn(),
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

const createFile = () => new File(['dummy'], 'icon.png', { type: 'image/png' });

describe('useUserIconUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadIcon', () => {
    it('FormData でアップロードできる', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.POST.mockResolvedValue({ response: { ok: true } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      const file = createFile();
      await act(async () => {
        const success = await result.current.uploadIcon(1, file);
        expect(success).toBe(true);
      });

      expect(mockApiClient.POST).toHaveBeenCalledWith('/v1/users/{user}/icon', {
        params: { path: { user: 1 } },
        headers: { 'Content-Type': null },
        body: expect.any(FormData),
      });
      // boundary を壊さないよう FormData をそのまま渡している
      const options = mockApiClient.POST.mock.calls[0][1] as unknown as { body: FormData };
      expect(options.body.get('icon')).toBe(file);
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'アイコンを更新しました',
        type: 'success',
      });
      expect(mockMutate).toHaveBeenCalled();
    });

    it('401エラーの場合、Snackbar を出さない', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 401 } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.uploadIcon(1, createFile());
        expect(success).toBe(false);
      });

      expect(mockShowSnackbar).not.toHaveBeenCalled();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('403エラーの場合、権限のメッセージが表示される', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 403 } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.uploadIcon(1, createFile());
        expect(success).toBe(false);
      });

      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: '他のユーザのアイコンは変更できません。',
        type: 'error',
      });
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('404エラーの場合、メッセージが表示される', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 404 } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.uploadIcon(1, createFile());
        expect(success).toBe(false);
      });

      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'ユーザが見つかりません。',
        type: 'error',
      });
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('422エラーの場合、バリデーションメッセージが表示される', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 422 } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.uploadIcon(1, createFile());
        expect(success).toBe(false);
      });

      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: '画像の形式またはサイズが正しくありません。',
        type: 'warning',
      });
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('500エラーの場合、汎用エラーメッセージが表示される', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.POST.mockResolvedValue({ response: { ok: false, status: 500 } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.uploadIcon(1, createFile());
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
      mockApiClient.POST.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.uploadIcon(1, createFile());
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
      mockApiClient.POST.mockReturnValue(promise as any);
      const { result } = renderHook(() => useUserIconUpdate({}), { wrapper: TestWrapper });

      expect(result.current.isSubmitting).toBe(false);

      act(() => {
        void result.current.uploadIcon(1, createFile());
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
  });

  describe('deleteIcon', () => {
    it('正常に削除できる', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.DELETE.mockResolvedValue({ response: { ok: true } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.deleteIcon(3);
        expect(success).toBe(true);
      });

      expect(mockApiClient.DELETE).toHaveBeenCalledWith('/v1/users/{user}/icon', {
        params: { path: { user: 3 } },
      });
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'アイコンを削除しました',
        type: 'success',
      });
      expect(mockMutate).toHaveBeenCalled();
    });

    it('403エラーの場合、権限のメッセージが表示される', async () => {
      const mockMutate = vi.fn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockApiClient.DELETE.mockResolvedValue({ response: { ok: false, status: 403 } } as any);
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        const success = await result.current.deleteIcon(3);
        expect(success).toBe(false);
      });

      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: '他のユーザのアイコンは変更できません。',
        type: 'error',
      });
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('例外が発生した場合、エラーメッセージが表示される', async () => {
      const mockMutate = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockApiClient.DELETE.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useUserIconUpdate({ mutate: mockMutate }), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.deleteIcon(3);
      });

      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: 'エラーが発生しました。',
        type: 'error',
      });
      expect(mockMutate).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  it('戻り値のプロパティが揃う', () => {
    const { result } = renderHook(() => useUserIconUpdate({}), { wrapper: TestWrapper });
    expect(result.current).toHaveProperty('uploadIcon');
    expect(result.current).toHaveProperty('deleteIcon');
    expect(result.current).toHaveProperty('isSubmitting');
    expect(result.current).toHaveProperty('showSnackbar');
  });
});
