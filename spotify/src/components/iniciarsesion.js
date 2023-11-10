import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link } from "react-router-dom";
import './form.css'
//import Alerta from './alerta';

function IniciarSesion() {
  const [botonHabilitado] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="modal-form">
      <form className="modal-box" id="form">
        <div className="inter-modal">
          <div className="form-title">
            <span>Inicia sesión en React Music</span>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="username">Nombre de usuario *</label>
              <input autoFocus required
                autoComplete="new-username"
                type="text"
                id="username"
                name="username"
                placeholder="Escriba su nombre de usuario"
              />
            </div>
          </div><br />

          <div className="campo">
            <div className="input-box">
              <label htmlFor="password">Contraseña *</label>
              <input required
                autoComplete="new-password"
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Escriba su contraseña"
              />

              <button
                type='button'
                className='ojito'
                onClick={() => { setPasswordVisible(!passwordVisible); }}
              >
                {passwordVisible ? (<VscEye />) : (<VscEyeClosed />)}
              </button>
            </div>
          </div>

          <div className="campo">
            <div className="btn-box">
              <button type="submit" className="btn-next" disabled={!botonHabilitado}>Aceptar</button>
              <Link to="/" className="custom-link">Cancelar</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IniciarSesion;
