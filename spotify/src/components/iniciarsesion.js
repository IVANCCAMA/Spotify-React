import React, { useState, useEffect } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import './form.css'

function IniciarSesion({ showForm = true }) {
  const [botonHabilitado] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [btnCancel, setBtnCancel] = useState(false);

  const location = useLocation();
  const isLoginRoute = location.pathname === '/iniciarsesion';
  const dynamicStyle = {
    display: showForm !== btnCancel ? 'flex' : 'none',
    background: isLoginRoute ? '' : 'rgba(128, 128, 128, 0.5)'
  };

  return (
    <div className='form-contend' style={dynamicStyle}>
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

                {isLoginRoute ? (
                  <Link to="/" className="custom-link">Cancelar</Link>
                ) : (
                  <button
                    type="button"
                    className="btn-next"
                    onClick={() => { setBtnCancel(!btnCancel) }}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
