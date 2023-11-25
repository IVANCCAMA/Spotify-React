import React from 'react';

interface TextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  required?: boolean;
  isValid?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  value,
  onChange,
  required = false,
  isValid = true,
  minLength = 0,
  maxLength = 20,
  placeholder = '',
}) => {
  return (
    <div className="campo">
      <div className="input-box">
        <label htmlFor={name}>{label}</label>
        <input
          autoFocus
          required={required}
          type="text"
          className={`validarNoRequiered${isValid ? (value?.length > 0 ? ' valid' : '') : ' active'}`}
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => { e.target.value = e.target.value.trim(); }}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder || undefined}
        />
      </div>
    </div>
  );
};

export default TextInput;
