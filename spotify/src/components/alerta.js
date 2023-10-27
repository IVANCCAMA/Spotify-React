import React from 'react';
import './alerta.css'

function Alerta({ isOpen, mensaje, onClose }) {
  // Si isOpen es false, entonces no se renderizamos nada.
  if (!isOpen) {
    return null;
  }
  
  // Si isOpen es true, entonces vamos mostrando el modal.
  return (
    <div className="modal-alerta" id="alerta">
        <div className="modal-alert-content">
            <div className="contenedor-p">
                <span id="modal-mensaje">{mensaje}</span>
            </div>
            <div className="separador"></div>
            <button className='boton-modal' autoFocus onClick={onClose}>OK</button>
        </div>
    </div>
  );
}

export default Alerta;
