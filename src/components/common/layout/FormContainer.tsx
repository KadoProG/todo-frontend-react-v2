import type { FC, ReactNode } from 'react';

import styles from '@/components/common/layout/FormContainer.module.scss';

interface FormContainerProps {
  /** 左側のラベルテキスト */
  label: string;
  /** 右側のコンテンツ */
  children: ReactNode;
  /** 左側の追加コンポーネント */
  left?: ReactNode;
}

export const FormContainer: FC<FormContainerProps> = (props) => (
  <div className={styles.FormContainer}>
    <div className={styles.FormContainer__left}>
      <p>{props.label}</p>
      {props.left}
    </div>
    <div>{props.children}</div>
  </div>
);
