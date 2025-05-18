import React from 'react';

/**
 * スケルトンローディング
 */
export const Skeleton: React.FC = () => (
  <div
    className="h-[30px] animate-skeleton-loading rounded bg-skeleton-gradient dark:bg-skeleton-gradient-dark"
    style={{ backgroundSize: '200% 100%' }}
  />
);
