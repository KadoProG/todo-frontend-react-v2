import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { alertColorStyles, MessageObject, SnackbarContext } from '.';

export const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [messageObjects, setMessageObjects] = useState<(MessageObject & { disabled: boolean })[]>(
    []
  );

  const showSnackbar = useCallback((args: MessageObject) => {
    const newMessageObject = { ...args, disabled: false };
    setMessageObjects((prev) => [...prev, newMessageObject]);
  }, []);

  const setDisabledAll = useCallback(() => {
    setMessageObjects((prev) => prev.map((v) => ({ ...v, disabled: true })));
  }, []);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <div className="fixed top-0 left-0 flex w-full justify-center" onClick={setDisabledAll}>
        <div className="flex w-full max-w-[300px] flex-col gap-2 rounded-2xl">
          {messageObjects.map((v, i) => {
            const alertColorStyle = alertColorStyles.find((style) => style.type === v.type);
            return (
              <div
                key={`snackbar-${i}`}
                className={`m-2 flex w-full animate-snackbar-message overflow-hidden rounded-xl bg-bg-success ${v.disabled ? 'hidden' : ''} ${alertColorStyle?.className}`}
              >
                <p>{v.message}</p>
                <span>×</span>
              </div>
            );
          })}
        </div>
      </div>
    </SnackbarContext.Provider>
  );
};
