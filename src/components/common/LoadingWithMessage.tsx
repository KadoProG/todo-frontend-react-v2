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
  <div className="fixed top-0 left-0 z-[1000] h-full w-full bg-black/20">
    <div className="bg-divider dark:bg-divider-dark absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 p-2">
      <div className="animate-rotate relative h-[60px] w-[60px]">
        <ReactIcon className="animate-rotate-reverse absolute h-[30px] w-[30px]" />
        <ViteIcon className="animate-rotate-reverse absolute right-0 bottom-0 h-[30px] w-[30px]" />
      </div>
      <div className="flex-1 text-base">
        <p>{props.message}</p>
      </div>
    </div>
  </div>
);
