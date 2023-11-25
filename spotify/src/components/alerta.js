import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './alerta.css'

function Alerta({ mensaje, redirectTo, setModalMessage }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(mensaje.length > 0);
  }, [mensaje]);

  const handleClose = () => {
    setIsOpen(false);
    setModalMessage("");
    if (redirectTo) {
      navigate(redirectTo);
    }
  }

  return (
    <div
      className="modal-alerta" id="alerta"
      style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="modal-alert-content">
        <div className="contenedor-p">
          <span id="modal-mensaje">{mensaje}</span>
        </div>
        <div className="separador"></div>
        <button
          className='boton-modal'
          autoFocus
          onClick={handleClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default Alerta;
