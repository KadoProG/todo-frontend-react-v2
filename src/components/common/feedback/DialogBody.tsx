import React from 'react';

import styles from '@/components/common/feedback/Dialog.module.scss';

interface DialogContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const DialogBody: React.FC<DialogContentProps> = (props) => (
  <div className={styles.dialog__body} style={props.style}>
    {props.children}
  </div>
);
