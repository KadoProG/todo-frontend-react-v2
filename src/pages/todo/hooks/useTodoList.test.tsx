import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTodoList } from '@/pages/todo/hooks/useTodoList';

// apiClientのモック
vi.mock('@/lib/apiClient', () => ({
  apiClient: {
    GET: vi.fn(),
  },
}));

// SWRのモック
const mockSWRData = vi.fn();
const mockSWRIsLoading = vi.fn();
const mockSWRError = vi.fn();
const mockSWRMutate = vi.fn();

vi.mock('swr', () => ({
  default: vi.fn(() => {
    return {
      data: mockSWRData(),
      isLoading: mockSWRIsLoading(),
      error: mockSWRError(),
      mutate: mockSWRMutate(),
    };
  }),
}));

describe('useTodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSWRData.mockReturnValue(undefined);
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRError.mockReturnValue(undefined);
    mockSWRMutate.mockReturnValue(vi.fn());
  });

  it('ローディング中の場合、isLoadingがtrueを返すこと', () => {
    mockSWRIsLoading.mockReturnValue(true);
    mockSWRData.mockReturnValue(undefined);

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.todos).toEqual([]);
  });

  it('データ取得成功時、todosを返すこと', () => {
    const mockTasks = [
      { id: 1, title: 'タスク1', description: '説明1', is_done: false, is_public: false },
      { id: 2, title: 'タスク2', description: '説明2', is_done: true, is_public: true },
    ];
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: {
        tasks: mockTasks,
      },
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual(mockTasks);
  });

  it('データが空の場合、todosが空配列を返すこと', () => {
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: {
        tasks: [],
      },
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual([]);
  });

  it('dataがundefinedの場合、todosが空配列を返すこと', () => {
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue(undefined);

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual([]);
  });

  it('data.dataがundefinedの場合、todosが空配列を返すこと', () => {
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: undefined,
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual([]);
  });

  it('data.data.tasksがundefinedの場合、todosが空配列を返すこと', () => {
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: {
        tasks: undefined,
      },
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual([]);
  });

  it('mutate関数が正しく返されること', () => {
    const mockMutate = vi.fn();
    mockSWRMutate.mockReturnValue(mockMutate);
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: {
        tasks: [],
      },
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current.mutate).toBe(mockMutate);
    expect(typeof result.current.mutate).toBe('function');
  });

  it('複数のタスクが存在する場合、すべてのタスクを返すこと', () => {
    const mockTasks = [
      { id: 1, title: 'タスク1', description: '説明1', is_done: false, is_public: false },
      { id: 2, title: 'タスク2', description: '説明2', is_done: true, is_public: true },
      { id: 3, title: 'タスク3', description: '説明3', is_done: false, is_public: false },
    ];
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: {
        tasks: mockTasks,
      },
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual(mockTasks);
    expect(result.current.todos).toHaveLength(3);
  });

  it('戻り値が正しい', () => {
    mockSWRIsLoading.mockReturnValue(false);
    mockSWRData.mockReturnValue({
      data: {
        tasks: [],
      },
    });

    const { result } = renderHook(() => useTodoList());

    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('todos');
    expect(result.current).toHaveProperty('mutate');

    expect(typeof result.current.isLoading).toBe('boolean');
    expect(Array.isArray(result.current.todos)).toBe(true);
    expect(typeof result.current.mutate).toBe('function');
  });
});
