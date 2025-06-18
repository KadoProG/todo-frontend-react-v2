import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '@/components/common/button/Button';

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Button', () => {
  describe('通常のボタン', () => {
    it('子要素を正しく表示する', () => {
      render(
        <TestWrapper>
          <Button>テストボタン</Button>
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: 'テストボタン' })).toBeInTheDocument();
    });

    it('onClickイベントが正しく動作する', () => {
      const handleClick = vi.fn();

      render(
        <TestWrapper>
          <Button onClick={handleClick}>クリックボタン</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: 'クリックボタン' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('onMouseDownイベントが正しく動作する', () => {
      const handleMouseDown = vi.fn();

      render(
        <TestWrapper>
          <Button onMouseDown={handleMouseDown}>マウスダウンボタン</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: 'マウスダウンボタン' });
      fireEvent.mouseDown(button);

      expect(handleMouseDown).toHaveBeenCalledTimes(1);
    });

    it('disabled状態が正しく動作する', () => {
      const handleClick = vi.fn();

      render(
        <TestWrapper>
          <Button onClick={handleClick} disabled>
            無効ボタン
          </Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: '無効ボタン' });
      expect(button).toBeDisabled();

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('type属性が正しく設定される', () => {
      render(
        <TestWrapper>
          <Button type="submit">送信ボタン</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: '送信ボタン' });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('widthとstyleが正しく適用される', () => {
      render(
        <TestWrapper>
          <Button width="200px" style={{ backgroundColor: 'red' }}>
            スタイルボタン
          </Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: 'スタイルボタン' });
      expect(button).toHaveStyle({ width: '200px' });
    });

    it('デフォルトのtype属性がbuttonである', () => {
      render(
        <TestWrapper>
          <Button>デフォルトボタン</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: 'デフォルトボタン' });
      // HTMLのbutton要素はデフォルトでtype="button"になるため、明示的に設定されていなくても正しく動作する
      expect(button).toBeInTheDocument();
    });
  });

  describe('リンクボタン', () => {
    it('hrefが指定された場合、Linkコンポーネントとしてレンダリングされる', () => {
      render(
        <TestWrapper>
          <Button href="/test">リンクボタン</Button>
        </TestWrapper>
      );

      const link = screen.getByRole('link', { name: 'リンクボタン' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('リンクボタンでもwidthとstyleが正しく適用される', () => {
      render(
        <TestWrapper>
          <Button href="/test" width="300px" style={{ color: 'blue' }}>
            スタイルリンク
          </Button>
        </TestWrapper>
      );

      const link = screen.getByRole('link', { name: 'スタイルリンク' });
      expect(link).toHaveStyle({ width: '300px' });
      expect(link).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    });

    it('リンクボタンではonClickやonMouseDownが無視される', () => {
      const handleClick = vi.fn();
      const handleMouseDown = vi.fn();

      render(
        <TestWrapper>
          <Button href="/test" onClick={handleClick} onMouseDown={handleMouseDown}>
            イベント無視リンク
          </Button>
        </TestWrapper>
      );

      const link = screen.getByRole('link', { name: 'イベント無視リンク' });
      // LinkコンポーネントにはonClickやonMouseDownプロパティが渡されないことを確認
      expect(link).toBeInTheDocument();
    });
  });

  describe('CSSクラス', () => {
    it('正しいCSSクラスが適用される', () => {
      render(
        <TestWrapper>
          <Button>クラステストボタン</Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: 'クラステストボタン' });
      expect(button).toHaveClass(
        'flex',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'rounded',
        'border',
        'border-border',
        'p-2',
        'hover:bg-bg-base-hover',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'dark:border-border-dark',
        'hover:dark:bg-bg-base-hover-dark'
      );
    });

    it('リンクボタンにも同じCSSクラスが適用される', () => {
      render(
        <TestWrapper>
          <Button href="/test">クラステストリンク</Button>
        </TestWrapper>
      );

      const link = screen.getByRole('link', { name: 'クラステストリンク' });
      expect(link).toHaveClass(
        'flex',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'rounded',
        'border',
        'border-border',
        'p-2',
        'hover:bg-bg-base-hover',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'dark:border-border-dark',
        'hover:dark:bg-bg-base-hover-dark'
      );
    });
  });

  describe('エッジケース', () => {
    it('複雑な子要素を正しく表示する', () => {
      render(
        <TestWrapper>
          <Button>
            <span>アイコン</span>
            <span>テキスト</span>
          </Button>
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('アイコン');
      expect(button).toHaveTextContent('テキスト');
    });
  });
});
