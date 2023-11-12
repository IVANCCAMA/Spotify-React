import React, { useState } from 'react';
import './alerta.css'

function Alerta({ alertParameters = { isOpen: false, mensaje: "", redirectTo: "" } }) {

  const [btnClick, serBtnClick] = useState(false);

  function handleCloseAndRedirect() {
    alertParameters.isOpen = false;
    if (alertParameters.redirectTo) {
      window.location.replace(alertParameters.redirectTo);
    }
  }

  return (
    <div
      className="modal-alerta" id="alerta"
      style={{ display: alertParameters.isOpen ? 'flex' : 'none' }}>
      <div className="modal-alert-content">
        <div className="contenedor-p">
          <span id="modal-mensaje">{alertParameters.mensaje}</span>
        </div>
        <div className="separador"></div>
        <button
          className='boton-modal'
          autoFocus
          onClick={handleCloseAndRedirect}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default Alerta;
