import type { FC } from 'react';

import ReactIcon from '@/assets/react.svg?react';
import ViteIcon from '@/assets/vite.svg?react';

interface LoadingWithMessageProps {
  message?: string;
}

/**
 * メッセージ付きローディング
 */
export const LoadingWithMessage: FC<LoadingWithMessageProps> = (props) => (
  <div className="fixed top-0 left-0 z-[1000] h-full w-full bg-black/20">
    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 bg-divider p-2 dark:bg-divider-dark">
      <div className="relative h-[60px] w-[60px] animate-rotate">
        <ReactIcon className="absolute h-[30px] w-[30px] animate-rotate-reverse" />
        <ViteIcon className="absolute right-0 bottom-0 h-[30px] w-[30px] animate-rotate-reverse" />
      </div>
      <div className="flex-1 text-base">
        <p>{props.message}</p>
      </div>
    </div>
  </div>
);
