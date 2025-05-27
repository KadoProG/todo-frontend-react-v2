import { snackbarContext } from '@/components/common/feedback/snackbarContext';
import React, { HTMLAttributes } from 'react';

type AlertColor = 'success' | 'error' | 'info' | 'warning';

const alertColorStyles: {
  type: AlertColor;
  className: HTMLAttributes<HTMLElement>['className'];
}[] = [
  {
    type: 'success',
    className: 'bg-bg-success dark:bg-bg-success-dark',
  },
  {
    type: 'info',
    className: 'bg-bg-info dark:bg-bg-info-dark',
  },
  {
    type: 'warning',
    className: 'bg-bg-warning dark:bg-bg-warning-dark',
  },
  {
    type: 'error',
    className: 'bg-bg-error dark:bg-bg-error-dark',
  },
];

interface SnackbarContextProviderProps {
  children: React.ReactNode;
}

export const SnackbarContextProvider: React.FC<SnackbarContextProviderProps> = (props) => {
  const [messageObjects, setMessageObjects] = React.useState<
    { message: string; type: AlertColor; disabled: boolean }[]
  >([]);

  const showSnackbar = React.useCallback((args: { message: string; type: AlertColor }) => {
    const newMessageObject = { ...args, disabled: false };
    setMessageObjects((prev) => [...prev, newMessageObject]);
  }, []);

  const setDisabledAll = React.useCallback(() => {
    setMessageObjects((prev) => prev.map((v) => ({ ...v, disabled: true })));
  }, []);

  return (
    <snackbarContext.Provider value={{ showSnackbar }}>
      {props.children}
      <div className="fixed top-0 left-0 z-1 flex w-full justify-center" onClick={setDisabledAll}>
        <div className="flex w-full max-w-[300px] flex-col gap-2 rounded-2xl">
          {messageObjects.map((v, i) => {
            const alertColorStyle = alertColorStyles.find((style) => style.type === v.type);
            return (
              <div
                key={i}
                className={`m-2 flex w-full animate-snackbar-message overflow-hidden rounded-xl bg-bg-success ${v.disabled ? 'hidden' : ''} ${alertColorStyle?.className}`}
              >
                <p className="flex-1 p-2">{v.message}</p>
                <span
                  aria-label="閉じる"
                  className="flex h-full cursor-pointer items-center justify-center bg-[rgba(255,255,255,0.2)] px-4 hover:bg-[rgba(255,255,255,0.4)]"
                >
                  ×
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </snackbarContext.Provider>
  );
};
