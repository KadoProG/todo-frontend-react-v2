import { FC, ReactNode, useEffect, useRef } from 'react';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};
export const DialogBase: FC<Props> = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;

    const dialogNode = dialogRef.current;
    if (!dialogNode) return;

    // フォーカス可能な要素を取得する関数
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];
    const focusableElements = dialogNode.querySelectorAll<HTMLElement>(
      focusableSelectors.join(',')
    );

    // 最初のフォーカス可能要素にフォーカス、なければダイアログ自体にフォーカス
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      dialogNode.focus();
    }

    // フォーカストラップのためのキーダウンイベントハンドラ
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = Array.from(focusableElements);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // ダイアログ外のフォーカスを防ぐためにフォーカスインイベントも監視しても良いが、
    // ここではキーボード操作だけ制御

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return;
  return (
    <div
      className="fixed top-0 left-0 z-10 flex h-svh w-svw items-center justify-center bg-[rgba(0,0,0,0.1)]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="m-4 w-md rounded-xl bg-bg-base p-4 dark:bg-bg-base-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
