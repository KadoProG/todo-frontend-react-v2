import React from 'react';

interface CloseButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  style?: React.CSSProperties;
}

export const CloseButton: React.FC<CloseButtonProps> = (props) => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    className="flex min-h-8 cursor-pointer items-center justify-center rounded border-none transition-colors duration-300 hover:bg-[#ebd5d5] disabled:cursor-not-allowed dark:hover:bg-[#6d4d50] dark:[&_img]:invert disabled:[&>*]:opacity-30"
    type={props.type}
    style={props.style}
  >
    <img src="/images/icons/close.svg" alt="Close" className="size-8" />
  </button>
);
