import React from 'react';

import { CloseButton } from '@/components/common/button/CloseButton';
import { DeleteButton } from '@/components/common/button/DeleteButton';
import styles from '@/components/common/feedback/Dialog.module.scss';

interface DialogHeaderProps {
  title: string;
  onDelete?: () => void;
  onClose?: () => void;
}

export const DialogHeader: React.FC<DialogHeaderProps> = (props) => (
  <div className={styles.dialog__header}>
    <h2>{props.title}</h2>
    {props.onDelete && <DeleteButton type="button" onClick={props.onDelete} />}
    {props.onClose && <CloseButton type="button" onClick={props.onClose} />}
  </div>
);
