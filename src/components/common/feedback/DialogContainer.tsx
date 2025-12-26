import React from 'react';

import styles from '@/components/common/feedback/Dialog.module.scss';

interface DialogContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const DialogContainer: React.FC<DialogContainerProps> = (props) => (
  <div
    className={styles.dialog}
    style={{ display: props.isOpen ? 'flex' : 'none' }}
    onClick={props.onClose}
  >
    {props.children}
  </div>
);
