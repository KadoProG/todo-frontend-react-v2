import React from 'react';

interface DeleteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  style?: React.CSSProperties;
}

export const DeleteButton: React.FC<DeleteButtonProps> = (props) => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    className="bg-error dark:bg-error-dark disabled:hover:bg-error dark:disabled:hover:bg-error-dark flex min-h-8 cursor-pointer items-center justify-center rounded border-none px-1 transition-colors duration-300 hover:bg-[#ebd5d5] disabled:cursor-not-allowed dark:hover:bg-[#6d4d50] dark:[&_img]:invert disabled:[&>*]:opacity-30"
    type={props.type}
    style={props.style}
  >
    <img src="/images/icons/delete.svg" alt="Delete" className="size-8" />
  </button>
);
