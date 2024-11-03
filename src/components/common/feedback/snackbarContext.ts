import React from 'react';

type AlertColor = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextType {
  showSnackbar: (args: { message: string; type: AlertColor }) => void;
}

export const snackbarContext = React.createContext<SnackbarContextType>({
  showSnackbar: () => {}, // ダミー関数
});

export const useSnackbarContext = (): SnackbarContextType => React.useContext(snackbarContext);
