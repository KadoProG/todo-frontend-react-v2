import type { CSSProperties, FC, ReactNode } from 'react';

import styles from '@/components/common/feedback/Dialog.module.scss';

interface DialogActionsProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const DialogActions: FC<DialogActionsProps> = (props) => (
  <div className={styles.dialog__actions} style={props.style}>
    {props.children}
  </div>
);
