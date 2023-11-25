import '../form.css';
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormProps {
  children: ReactNode;
  showAlertModal: (mensaje: string, redirectTo?: string) => void;
  title?: string;
  requiredConnection?: boolean;
  onSubmit: () => void;
  onclickCancelRedirectTo?: string;
  onClickCancel?: () => void;
}

const Form: React.FC<FormProps> = ({
  children,
  showAlertModal,
  title = '',
  requiredConnection = false,
  onSubmit,
  onclickCancelRedirectTo = '',
  onClickCancel
}) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isAcceptButtonDisabled, setIsAcceptButtonDisabled] = useState(false);

  const handleOnlineStatusChange = () => {
    setIsOnline(window.navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    setIsAcceptButtonDisabled(true);
    if (!requiredConnection || isOnline) {
      await onSubmit();
    } else {
      showAlertModal(`Error de connceción. Intente de nuevo más tarde`);
    }
    setIsAcceptButtonDisabled(false);
  };

  const handleOnClickCancel = () => {
    if (onClickCancel) {
      onClickCancel();
    }
    if (onclickCancelRedirectTo) {
      navigate(onclickCancelRedirectTo);
    }
  }

  return (
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={handleOnSubmit}>
        <div className="inter-modal">
          {title && (
            <div className="form-title">
              <span>{title}</span>
            </div>
          )}

          {children}

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next" disabled={isAcceptButtonDisabled}>
                Aceptar
              </button>
              
              <button type="button" className="btn-next" onClick={handleOnClickCancel}>
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
