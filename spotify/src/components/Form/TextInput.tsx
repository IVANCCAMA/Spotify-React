import React, { useEffect } from 'react';

interface TextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  isRequired?: boolean;
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
  isRequired = true,
  isValid = true,
  minLength = 0,
  maxLength = 20,
  placeholder = '',
}) => {
  useEffect(() => {
    const inputElement = document.getElementById(name);
    inputElement?.classList.toggle('active', !isValid && value.length > 0);
  }, [isValid]);

  return (
    <div className="campo">
      <div className="input-box">
        <label htmlFor={name}>{label}</label>
        <input
          autoFocus
          required={isRequired}
          type="text"
          className="validar"
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
