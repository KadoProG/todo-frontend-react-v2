import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useContext } from 'react';
import { ThemeContext } from '.';
import { store } from '@/lib/store';
import { ThemeProvider } from '@/contexts/Theme/ThemeProvider';

// storeのモック
vi.mock('@/lib/store', () => ({
  store: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

// matchMediaのモック
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// テスト用のコンポーネント
const TestComponent = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => updateTheme('light')} data-testid="light-btn">
        Light
      </button>
      <button onClick={() => updateTheme('dark')} data-testid="dark-btn">
        Dark
      </button>
      <button onClick={() => updateTheme('device')} data-testid="device-btn">
        Device
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトでlightテーマを返すように設定
    vi.mocked(store.get).mockReturnValue('light');
    // DOMクラスをクリア
    document.documentElement.classList.remove('dark');

    // デフォルトのmatchMediaモックを設定（ライトモード）
    const defaultMockMediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(defaultMockMediaQuery);
  });

  afterEach(() => {
    // テスト後にDOMクラスをクリア
    document.documentElement.classList.remove('dark');
  });

  describe('初期化', () => {
    it('storeから初期テーマを取得して設定する', () => {
      vi.mocked(store.get).mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(store.get).toHaveBeenCalledWith('theme');
    });

    it('デフォルトでlightテーマが設定される', () => {
      vi.mocked(store.get).mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('テーマ更新', () => {
    it('lightテーマに更新できる', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('light-btn'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(store.set).toHaveBeenCalledWith('theme', 'light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('darkテーマに更新できる', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('dark-btn'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(store.set).toHaveBeenCalledWith('theme', 'dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('deviceテーマに更新できる', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('device-btn'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('device');
      expect(store.set).toHaveBeenCalledWith('theme', 'device');
    });
  });

  describe('DOMクラス操作', () => {
    it('lightテーマ時にdarkクラスを削除する', () => {
      // 事前にdarkクラスを追加
      document.documentElement.classList.add('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('light-btn'));

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('darkテーマ時にdarkクラスを追加する', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('dark-btn'));

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('テーマ変更時に適切にクラスを切り替える', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // darkテーマに変更
      fireEvent.click(screen.getByTestId('dark-btn'));
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // lightテーマに変更
      fireEvent.click(screen.getByTestId('light-btn'));
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('deviceテーマのメディアクエリ対応', () => {
    it('ダークモードが有効な場合、darkクラスを追加する', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      mockMatchMedia.mockReturnValue(mockMediaQuery);

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('device-btn'));

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('ライトモードが有効な場合、darkクラスを削除する', () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      mockMatchMedia.mockReturnValue(mockMediaQuery);

      // 事前にdarkクラスを追加
      document.documentElement.classList.add('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('device-btn'));

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('メディアクエリのイベントリスナーを適切に設定・削除する', () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      mockMatchMedia.mockReturnValue(mockMediaQuery);

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.click(screen.getByTestId('device-btn'));

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // コンポーネントをアンマウント
      unmount();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('コンテキスト値の提供', () => {
    it('正しいコンテキスト値を提供する', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeElement = screen.getByTestId('current-theme');
      expect(themeElement).toBeInTheDocument();
      expect(themeElement).toHaveTextContent('light');
    });

    it('updateTheme関数が正しく動作する', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // 初期状態
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      // テーマを更新
      fireEvent.click(screen.getByTestId('dark-btn'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(store.set).toHaveBeenCalledWith('theme', 'dark');
    });
  });
});
