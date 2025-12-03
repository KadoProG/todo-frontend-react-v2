import { cn } from '@/utils';
import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  children: React.ReactNode;
  href?: string;
  width?: React.CSSProperties['width'];
  style?: React.CSSProperties;
  className?: string;
}

export const Button: React.FC<ButtonProps> = (props) =>
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
