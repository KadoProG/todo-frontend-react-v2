import { ThemeContext } from '@/contexts/Theme';
import { FC, KeyboardEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';

const options: {
  value: 'light' | 'dark' | 'device';
  label: string;
}[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'device', label: 'Device' },
];

export const ThemeSwitch: FC = () => {
  const { theme, updateTheme } = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex((option) => option.value === theme)
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectOption = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      updateTheme(options[index].value);
      setIsOpen(false);
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    },
    [updateTheme]
  );

  // キーボード操作
  const onButtonKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
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
  }, []);

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
    [highlightedIndex, selectOption]
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
    <div ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={onButtonKeyDown}
        ref={buttonRef}
        id="select-button"
        className="w-full rounded border border-border p-2 dark:border-border-dark"
      >
        {options[selectedIndex].label}
      </button>
      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby="select-label"
          tabIndex={-1}
          ref={listRef}
          onKeyDown={onOptionKeyDown}
          className="max-h-[150px] overflow-y-auto border border-border dark:border-border-dark"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={highlightedIndex === index ? 0 : -1}
              onClick={() => selectOption(index)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`block cursor-pointer ${highlightedIndex === index ? 'bg-bg-base-hover dark:bg-bg-base-hover-dark' : ''}`}
              style={{
                padding: '4px 8px',
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      <span id="select-label" className="sr-only">
        シーンの設定
      </span>
    </div>
  );
};
