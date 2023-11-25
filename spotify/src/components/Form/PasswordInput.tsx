import React, { ReactNode, useState } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface PasswordInputProps {
  children: ReactNode;
  name: string;
  label: string;
  value: string;
  onChange?: (newValue: string) => void;
  onFocus?: (newValue: string) => void;
  onBlur?: (newValue: string) => void;
  required?: boolean;
  isValid?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  children,
  name,
  label,
  value,
  onChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  required = false,
  isValid = true,
  minLength = 0,
  maxLength = 20,
  placeholder = '',
  autoComplete = '',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="campo">
      <div className="input-box">
        <label htmlFor={name}>{label}</label>

        <input
          autoFocus
          required={required}
          autoComplete={autoComplete}
          type={isPasswordVisible ? "text" : "password"}
          className={`validarNoRequiered${isValid ? (value?.length > 0 ? ' valid' : '') : ' active'}`}
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => onFocus(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder || undefined}
        />

        {children}

        <button
          type='button'
          className='ojito'
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (<VscEye />) : (<VscEyeClosed />)}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
