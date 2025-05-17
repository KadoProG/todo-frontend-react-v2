import { FC, ReactNode } from 'react';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};
export const DialogBase: FC<Props> = (props) => {
  if (!props.isOpen) return;
  return (
    <div
      className="fixed top-0 left-0 z-10 flex h-svh w-svw items-center justify-center bg-[rgba(0,0,0,0.1)]"
      onClick={props.onClose}
    >
      <div className="m-4 w-md rounded-xl bg-bg-base p-4" onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};
