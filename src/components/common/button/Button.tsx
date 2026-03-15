import type { CSSProperties, FC, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/utils';

interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: MouseEvent) => void;
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  children: ReactNode;
  href?: string;
  width?: CSSProperties['width'];
  style?: CSSProperties;
  className?: string;
}

export const Button: FC<ButtonProps> = (props) =>
  props.href ? (
    <Link
      to={props.href}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded border border-border p-2 hover:bg-bg-base-hover disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark hover:dark:bg-bg-base-hover-dark',
        props.className
      )}
      style={{ width: props.width, ...props.style }}
    >
      {props.children}
    </Link>
  ) : (
    <button
      onMouseDown={props.onMouseDown}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded border border-border p-2 hover:bg-bg-base-hover disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark hover:dark:bg-bg-base-hover-dark',
        props.className
      )}
      style={{ width: props.width, ...props.style }}
    >
      {props.children}
    </button>
  );
