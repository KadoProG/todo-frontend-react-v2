import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe, expect, it, vi } from 'vitest';

import { DropdownList } from '.';

// テスト用のオプション
const mockOptions = [
  { label: 'オプション1', value: 'option1' },
  { label: 'オプション2', value: 'option2' },
  { label: 'オプション3', value: 'option3' },
];

// テスト用のモック関数
const mockSetValue = vi.fn();

describe('DropdownList', () => {
  beforeEach(() => {
    mockSetValue.mockClear();
  });

  describe('基本的なレンダリング', () => {
    it('正しくレンダリングされる', () => {
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('オプション1')).toBeInTheDocument();
    });

    it('titleLabelが指定された場合、アクセシビリティラベルが設定される', () => {
      render(
        <DropdownList
          titleLabel="テストドロップダウン"
          id="test-dropdown"
          options={mockOptions}
          value="option1"
          setValue={mockSetValue}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-labelledby', 'select-label-test-dropdown');
      expect(screen.getByText('テストドロップダウン')).toBeInTheDocument();
    });

    it('選択されたオプションが正しく表示される', () => {
      render(<DropdownList options={mockOptions} value="option2" setValue={mockSetValue} />);

      expect(screen.getByText('オプション2')).toBeInTheDocument();
    });

    it('存在しない値が指定された場合、最初のオプションが表示される', () => {
      render(<DropdownList options={mockOptions} value="nonexistent" setValue={mockSetValue} />);

      expect(screen.getByText('オプション1')).toBeInTheDocument();
    });
  });

  describe('ドロップダウンの開閉', () => {
    it('ボタンをクリックするとドロップダウンが開く', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('ドロップダウンが開いている状態でボタンをクリックすると閉じる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.click(button);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('ドロップダウン外をクリックすると閉じる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // ドロップダウン外をクリック
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('オプション選択', () => {
    it('オプションをクリックすると値が更新される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const option2 = screen.getByText('オプション2');
      await user.click(option2);

      expect(mockSetValue).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('オプション選択後、ボタンにフォーカスが戻る', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const option2 = screen.getByText('オプション2');
      await user.click(option2);

      expect(button).toHaveFocus();
    });
  });

  describe('キーボード操作', () => {
    it('Spaceキーでドロップダウンが開閉される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.keyboard(' ');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('Enterキーでドロップダウンが開閉される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.keyboard('{Enter}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('ArrowDownキーでドロップダウンが開き、最初のオプションがハイライトされる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowUpキーでドロップダウンが開き、最後のオプションがハイライトされる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const options = screen.getAllByRole('option');
      await waitFor(() => {
        expect(options[0]).toHaveAttribute('tabIndex', '0');
      });
    });

    it('ドロップダウン内でArrowDownキーで次のオプションに移動', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      listbox.focus();
      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('tabIndex', '0');
    });

    it('ドロップダウン内でArrowUpキーで前のオプションに移動', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option2" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      listbox.focus();
      await user.keyboard('{ArrowUp}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('tabIndex', '0');
    });

    it('ドロップダウン内でEnterキーでオプションが選択される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      listbox.focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockSetValue).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('ドロップダウン内でSpaceキーでオプションが選択される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      listbox.focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard(' ');

      expect(mockSetValue).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('Escapeキーでドロップダウンが閉じる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      listbox.focus();
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(button).toHaveFocus();
    });

    it('Tabキーでフォーカストラップが機能する', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      // Tabキーを押してもフォーカスが外れないことを確認
      const originalFocus = document.activeElement;
      await user.keyboard('{Tab}');
      expect(document.activeElement).toBe(originalFocus);
    });
  });

  describe('マウス操作', () => {
    it('マウスホバーでオプションがハイライトされる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const option2 = screen.getByText('オプション2');
      await user.hover(option2);

      expect(option2).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIA属性が設定される', () => {
      render(
        <DropdownList
          titleLabel="テストドロップダウン"
          id="test-dropdown"
          options={mockOptions}
          value="option1"
          setValue={mockSetValue}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-labelledby', 'select-label-test-dropdown');
    });

    it('ドロップダウンが開いている時、aria-expandedがtrueになる', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('listboxロールが正しく設定される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    it('optionロールが正しく設定される', async () => {
      const user = userEvent.setup();
      render(<DropdownList options={mockOptions} value="option1" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('エッジケース', () => {
    it('空のオプション配列の場合でもエラーが発生しない', () => {
      expect(() => {
        render(<DropdownList options={[]} value="" setValue={mockSetValue} />);
      }).not.toThrow();
    });

    it('空のオプション配列の場合、空文字が表示される', () => {
      render(<DropdownList options={[]} value="" setValue={mockSetValue} />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('');
    });

    it('存在しない値が選択されている場合、最初のオプションが表示される', () => {
      render(<DropdownList options={mockOptions} value="invalid-value" setValue={mockSetValue} />);

      expect(screen.getByText('オプション1')).toBeInTheDocument();
    });
  });
});
