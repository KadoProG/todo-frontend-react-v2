import styles from '@/components/common/LoadingWithMessage.module.scss';
import React from 'react';
import ReactIcon from '@/assets/react.svg?react';
import ViteIcon from '@/assets/vite.svg?react';

interface LoadingWithMessageProps {
  message?: string;
}

/**
 * メッセージ付きローディング
 */
export const LoadingWithMessage: React.FC<LoadingWithMessageProps> = (props) => (
  <div className={styles.loadingWithMessage}>
    <div className={styles.loadingWithMessage__bottom}>
      <div className={styles.loadingWithMessage__bottom__image}>
        <ReactIcon />
        <ViteIcon />
      </div>
      <div className={styles.loadingWithMessage__bottom__message}>
        <p>{props.message}</p>
      </div>
    </div>
  </div>
);
