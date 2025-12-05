import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import React from 'react';
import { cn } from '@/utils';

type MultiSelectProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  options: { label: string; value: string | number }[];
  style?: React.CSSProperties;
  required?: boolean;
  disabled?: boolean;
};

export const MultiSelect = <T extends FieldValues>(props: MultiSelectProps<T>) => {
  const { field, fieldState } = useController<T>({
    name: props.name,
    control: props.control,
  });

  const selectedValues = React.useMemo(() => {
    const value = field.value;
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    return [String(value)];
  }, [field.value]);

  const handleChange = React.useCallback(
    (optionValue: string | number, checked: boolean) => {
      const stringValue = String(optionValue);
      const currentValues: string[] = selectedValues;

      let newValues: string[];
      if (checked) {
        newValues = [...currentValues, stringValue];
      } else {
        newValues = currentValues.filter((v) => v !== stringValue);
      }

      // 数値の場合は数値配列に変換
      const isNumeric = props.options.some((opt) => typeof opt.value === 'number');
      if (isNumeric) {
        field.onChange(newValues.map(Number));
      } else {
        field.onChange(newValues);
      }
    },
    [selectedValues, field, props.options]
  );

  return (
    <div className="relative pb-5" style={props.style}>
      {props.label && (
        <div>
          <label htmlFor={props.name}>{props.label}</label>
          {props.required && (
            <span className="ml-1 text-[red]" aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}
      <div className="bg-bg-paper dark:bg-bg-paper-dark flex max-h-[200px] flex-col gap-2 overflow-y-auto rounded border border-border p-2 dark:border-border-dark">
        {props.options.map((option) => {
          const optionValue = String(option.value);
          const isChecked = selectedValues.includes(optionValue);
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded p-1 transition-colors',
                props.disabled
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:bg-bg-base-hover dark:hover:bg-bg-active-dark'
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                disabled={props.disabled}
                className="h-[18px] w-[18px] cursor-pointer"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {fieldState.error && (
        <p className="absolute mt-1 text-xs text-[red]">{fieldState.error.message}</p>
      )}
    </div>
  );
};
