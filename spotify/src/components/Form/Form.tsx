import '../form.css';
import React, { ReactNode } from 'react';

interface FormProps {
  children: ReactNode;
  title?: string;
  onSubmit: () => void;
  onClickAcceptButton?: () => void;
  onClickCancelButton?: () => void;
}

const Form: React.FC<FormProps> = ({ children, title = "", onSubmit, onClickAcceptButton, onClickCancelButton }) => {
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
              <button type="submit" className="btn-next" onClick={onClickAcceptButton || undefined}>
                Aceptar
              </button>
              <button type="button" className="btn-next" onClick={onClickCancelButton || undefined}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
