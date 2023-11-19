import React, { useEffect, useState } from 'react';

interface FileInputProps {
  name: string;
  label: string;
  isValid: boolean;
  isRequired?: boolean;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  isRequired = true,
  accept = '',
}) => {
  const [showFileName, setShowFileName] = useState(false);


  const handleFileChange = (e: any) => {
    const file = e.target.files && e.target.files[0];
    console.log(file);
    return;
    if (file) {
      e.target.previousElementSibling.innerText = file.name;
      e.target.previousElementSibling.style.display = 'block';
      e.target.nextElementSibling.value = "X";
      e.target.nextElementSibling.classList.add('active');
    }
  };

  const handleButtonClick = (e: any) => {
    e.target.previousElementSibling.click();
  };

  return (
    <div className="campo campo-cargar-cancion">
      {/* <div className="campo"> */}
      <div className="input-box">
        <label htmlFor={name}>{label}</label>
        <div className="seleccionarArchivo">
          <span
            className="nombreArchivo"
            id="nombreArchivo"
            style={{
              display: showFileName ? 'block' : 'none'
            }}>

          </span>
          <input
            type="file"
            id={name}
            name={name}
            required={isRequired}
            accept={accept}
            style={{ display: 'none' }}
            onChange={handleFileChange} />
          <button
            type="button"
            className="btn-subir"
            onClick={handleButtonClick}>
            Seleccionar imagen
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
