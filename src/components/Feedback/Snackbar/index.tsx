import { createContext, HTMLAttributes } from 'react';

type AlertColor = 'success' | 'error' | 'info' | 'warning';

export const alertColorStyles: {
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

export type MessageObject = {
  message: string;
  type: (typeof alertColorStyles)[number]['type'];
};

type SnackbarContextType = {
  showSnackbar: (args: MessageObject) => void;
};

export const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});
