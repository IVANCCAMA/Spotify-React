import React, { useEffect, useState } from 'react';

interface FileInputProps {
  name: string;
  label: string;
  fileName: string;
  onChange: (newFile: File) => void;
  required?: boolean;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  fileName,
  onChange,
  required = false,
  accept = '',
}) => {
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleButtonClick = (e: any) => {
    e.target.previousElementSibling?.click();
  };

  return (
    <div className="campo campo-cargar-cancion">
      <div className="input-box">
        <label htmlFor={name}>{label}</label>
        <div className="seleccionarArchivo">
          <span
            className="nombreArchivo"
            id="nombreArchivo"
            title={fileName || 'File name'}
            style={{ display: fileName ? 'block' : 'none' }}>
            {fileName}
          </span>

          <input
            type="file"
            id={name}
            name={name}
            required={required}
            accept={accept}
            style={{ display: 'none' }}
            onChange={handleFileChange} />

          <button
            type="button"
            className={`btn-subir${fileName ? ' active' : ''}`}
            onClick={handleButtonClick}>
            {fileName ? 'X' : 'Seleccionar imagen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
