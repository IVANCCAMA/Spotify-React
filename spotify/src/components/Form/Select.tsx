import React from 'react';

interface SelectProps {
  name: string;
  label: string;
  options: { value: string; title: string }[] | string[];
  onChange?: (newValue: string) => void;
  onFocus?: (newValue: string) => void;
  onBlur?: (newValue: string) => void;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  options,
  onChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  required = false,
  defaultValue = 'default',
  placeholder = '',
}) => {
  return (
    <div className="campo">
      <div className="input-box">
        <label htmlFor={name}>{label}</label>

        <select
          autoFocus
          required={required}
          name={name}
          id={name}
          defaultValue={defaultValue}
          value={options.length === 0 ? defaultValue : undefined}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => onFocus(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
        >
          {placeholder && (
            <option disabled hidden value='default'>{placeholder}</option>
          )}

          {options.map((option, index) => (
            <option
              key={`${name}-${index}`}
              value={typeof option === 'string' ? option : option.value}
            >
              {typeof option === 'string' ? option : option.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
