import { FC, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  titleLabel?: string;
  id?: string;
  options: { label: string; value: string }[];
  value: string;
  setValue: (value: string) => void;
};

export const DropdownList: FC<Props> = ({ titleLabel, id, options, value, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value]
  );

  // 安全なインデックス取得（-1の場合は0を返す）
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectOption = useCallback(
    (index: number) => {
      const newValue = options[index]?.value as string | undefined;
      if (!newValue) return;
      setValue(newValue);
      setIsOpen(false);
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    },
    [setValue, options]
  );

  // キーボード操作
  const onButtonKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(options.length - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          setIsOpen((prev) => !prev);
          break;
        default:
          break;
      }
    },
    [options.length]
  );

  const onOptionKeyDown = useCallback(
    (e: KeyboardEvent<HTMLUListElement>) => {
      const lastIndex = options.length - 1;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1 > lastIndex ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 < 0 ? lastIndex : prev - 1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          selectOption(highlightedIndex);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          if (buttonRef.current) {
            buttonRef.current.focus();
          }
          break;
        case 'Tab':
          // フォーカストラップ制御
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    [highlightedIndex, selectOption, options.length]
  );

  // 開いたら最初のハイライトを設定
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, selectedIndex]);

  // optionにフォーカスを移す
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const optionEl = listRef.current.querySelectorAll('[role="option"]')[
        highlightedIndex
      ] as HTMLDataListElement;
      optionEl?.focus();
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`select-label-${id}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={onButtonKeyDown}
        ref={buttonRef}
        id="select-button"
        className={`w-full cursor-pointer hover:bg-bg-base-hover dark:hover:bg-bg-base-hover-dark ${isOpen ? 'rounded-t' : 'rounded'} border border-border p-2 dark:border-border-dark`}
      >
        {options[safeSelectedIndex]?.label || ''}
      </button>
      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={`select-label-${id}`}
          tabIndex={-1}
          ref={listRef}
          onKeyDown={onOptionKeyDown}
          className="absolute top-[calc(100%_-_1px)] max-h-[150px] w-full overflow-y-auto rounded-b border border-border bg-bg-base dark:border-border-dark dark:bg-bg-base-dark"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={safeSelectedIndex === index}
              tabIndex={highlightedIndex === index ? 0 : -1}
              onClick={() => selectOption(index)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`block cursor-pointer px-1 py-2 ${highlightedIndex === index ? 'bg-bg-base-hover dark:bg-bg-base-hover-dark' : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      <span id={`select-label-${id}`} className="sr-only">
        {titleLabel}
      </span>
    </div>
  );
};
