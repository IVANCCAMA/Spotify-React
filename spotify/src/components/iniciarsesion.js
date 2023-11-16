import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import './form.css';
import axios from 'axios';
import { alfanumerico } from './form.js';

function IniciarSesion({ signOn, showAlertModal }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const ExisteArtista = async (nombreArtista) => {
    try {
      const query = `/usuarios/search_nom/ ?searchTerm=${nombreArtista}`;
      const response = await axios.get(`${database}${query}`);

      const artistas = response.data;
      const artistaEncontrado = artistas.find((artista) => artista.nombre_usuario === nombreArtista);

      if (artistaEncontrado && artistaEncontrado.id_usuario) {
        return artistaEncontrado;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return null;
    }
  };

  const validarCampos = async (campos) => {
    if (campos.username.length > 20 || campos.username.length < 1 || !alfanumerico(campos.username)) {
      document.getElementById('username').classList.add('active');
      return null;
    }
    if (campos.password.length > 40 || campos.password.length < 8) {
      document.getElementById('password').classList.add('active');
      return null;
    }

    // username
    const id_usuario = await ExisteArtista(campos.username);
    if (id_usuario === null) {
      document.getElementById('username').classList.add('active');
      showAlertModal('El usuario no existe, intente con otro');
      return null;
    } else if (id_usuario.tipo_usuario === "artista") {
      document.getElementById('username').classList.add('active');
      showAlertModal('El tipo de usuario no es valido');
      return null;
    }

    // password
    if (id_usuario.contrasenia_usuario !== campos.password) {
      document.getElementById('password').classList.add('active');
      showAlertModal('Contraseña incorrecta');
      return null;
    }

    return id_usuario;
  };

  const validarForm = async (e) => {
    setBotonHabilitado(false);
    try {
      e.preventDefault();

      const campos = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      };

      const user = await validarCampos(campos);
      if (user === null) {
        showAlertModal(`"Nombre de usuario o contraseña incorrectos"`);
        return;
      }

      try {
        // guardar user
        signOn(user);

        // redireccionar
        navigate('/');
      } catch (error) {
        console.error('Error:', error);
        showAlertModal(`Error al establecer conexión`);
      }
    } catch (error) {
      e.preventDefault();
      showAlertModal('Hubo un error al crear la carpeta, Intenta nuevamente');
    } finally {
      // Una vez que se complete, habilitar el botón nuevamente
      setBotonHabilitado(true);
    }
  };

  return (
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={validarForm}>
        <div className="inter-modal">
          <div className="form-title">
            <span>Inicia sesión en React Music</span>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="username">Nombre de usuario *</label>
              <input autoFocus required
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