import React from 'react';
import { useState } from 'react';
import './alerta.css.css'

function abrirModal(mensaje) {
  const modal = document.getElementById('alerta');
  const modalMensaje = document.getElementById('modal-mensaje');
  modalMensaje.textContent = mensaje;

  modal.style.display = 'block';
  deshabilitarFormulario('crear-lista');
}

function cerrarModal() {
  const modal = document.getElementById('alerta');
  const modalMensaje = document.getElementById('modal-mensaje');

  if (modalMensaje.getAttribute("form-valido") === "true") {
      // redireccionar
      window.location.reload();
  } else {
      habilitarFormulario('crear-lista')
      modal.style.display = 'none';
  }
}

function habilitarFormulario() {
  const formulario = document.getElementById("form");
  const elementos = formulario.elements;

  for (let i = 0; i < elementos.length; i++) {
      elementos[i].disabled = false;
  }
}

function deshabilitarFormulario() {
  const formulario = document.getElementById("form");
  const elementos = formulario.elements;

  for (let i = 0; i < elementos.length; i++) {
      elementos[i].disabled = true;
  }
}

function Alerta() {
  const [file, setFile] = useState(null);

  return (
    <div className="modal-alerta" id="alerta">
        <div className="modal-alert-content">
            <div className="contenedor-p">
                <span id="modal-mensaje" form-valido="false"></span>
            </div>
            <div className="separador"></div>
            <button onclick="cerrarModal() ">OK</button>
        </div>
    </div>
  );
};

export default Alerta;
