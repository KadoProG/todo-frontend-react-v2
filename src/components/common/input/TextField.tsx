import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import React from 'react';

export type TextFieldProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  /** フォーム上の名前 */
  name: string;
  /** プレースホルダー */
  placeholder?: string;
  /** 必須項目にするか */
  required?: boolean;
  /** デザインの追記 */
  style?: React.CSSProperties;
  /** inputのtype */
  type?: React.HTMLInputTypeAttribute;
  /** ロード時フォームフォーカス */
  autoFocus?: boolean;
  /** フィールドフォーカス解除時の動作 */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** フィールドが有効か否か */
  isActiveFocus?: boolean;
};

export const TextField = <T extends FieldValues>(props: TextFieldProps<T>) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const { field, fieldState } = useController<T>({
    name: props.name,
    control: props.control,
    rules: {
      ...props.rules,
      required: props.required ? '入力必須の項目です' : undefined,
    },
  });

  React.useEffect(() => {
    if (props.isActiveFocus) {
      ref.current?.focus();
    }
  }, [props.isActiveFocus]);

  return (
    <div className="relative pb-5" style={props.style}>
      {props.label && (
        <div>
          <label htmlFor={props.name}>{props.label}</label>
          {props.required && (
            <span className="text-[red]" aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}
      <input
        id={props.name}
        {...field}
        ref={ref}
        placeholder={props.placeholder}
        disabled={props.disabled}
        type={props.type}
        autoFocus={props.autoFocus}
        className={`w-full rounded border p-2 text-xl dark:text-text-dark ${fieldState.error ? 'border-[red]' : 'border-border dark:border-border-dark'}`}
        onBlur={props.onBlur}
      />
      {fieldState.error && (
        <p className="absolute text-sm text-[red]">{fieldState.error.message}</p>
      )}
    </div>
  );
};
