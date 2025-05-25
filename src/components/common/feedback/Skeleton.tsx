import { FC, HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement>;

/**
 * スケルトンローディング
 */
export const Skeleton: FC<Props> = (props) => (
  <div
    {...props}
    className={`h-[30px] animate-skeleton-loading rounded bg-skeleton-gradient dark:bg-skeleton-gradient-dark ${props.className}`}
    style={{ backgroundSize: '200% 100%', ...props.style }}
  />
);
