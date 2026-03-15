import { type CSSProperties, type FC, type ReactNode } from 'react';

import styles from '@/components/common/feedback/Dialog.module.scss';

interface DialogContentProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const DialogBody: FC<DialogContentProps> = (props) => (
  <div className={styles.dialog__body} style={props.style}>
    {props.children}
  </div>
);
