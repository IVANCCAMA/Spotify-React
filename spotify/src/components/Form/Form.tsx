import '../form.css';
import React, { ReactNode } from 'react';
import { Link } from "react-router-dom";

interface FormProps {
  children: ReactNode;
  title?: string;
  onSubmit: () => void;
  onClickAcceptButton?: () => void;
  onClickCancelButton?: () => void;
  botonHabilitado?: boolean; 
}

const Form: React.FC<FormProps> = ({ children, title = "", onSubmit, onClickAcceptButton, onClickCancelButton, botonHabilitado = true}) => {
  return (
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={onSubmit}>
        <div className="inter-modal">
          {title && (
            <div className="form-title">
              <span>{title}</span>
            </div>
          )}

          {children}

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next" onClick={onClickAcceptButton || undefined} disabled={!botonHabilitado}>
                Aceptar
              </button>
              <button type="button" className="btn-next" onClick={onClickCancelButton || undefined}>
                <Link to="/biblioteca" className="btn-next"><strong>Cancelar</strong></Link>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
