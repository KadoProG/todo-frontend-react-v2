import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type SelectProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  options: { label: string; value: string }[];
  style?: React.CSSProperties;
  required?: boolean;
};

export const Select = <T extends FieldValues>(props: SelectProps<T>) => {
  const { field, fieldState } = useController<T>({
    name: props.name,
    control: props.control,
  });

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
      <select
        id={props.name}
        {...field}
        disabled={props.disabled}
        className={`w-full rounded border bg-bg-base p-2 text-xl text-text dark:bg-bg-base-dark dark:text-text-dark ${
          fieldState.error ? 'border-[red]' : 'border-border dark:border-border-dark'
        }`}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {fieldState.error && (
        <p className="absolute text-sm text-[red]">{fieldState.error.message}</p>
      )}
    </div>
  );
};
