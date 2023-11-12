import React, { useState, useEffect } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import './form.css';
import axios from 'axios';
import { alfanumerico } from './form.js';

function IniciarSesion({ signOn, setIsModalOpen, setModalMessage, setRedirectTo }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      setModalMessage('El usuario no existe, intente con otro');
      setIsModalOpen(true);
      return null;
    } else if (id_usuario.tipo_usuario === "artista") {
      document.getElementById('username').classList.add('active');
      setModalMessage('El tipo de usuario no es valido');
      setIsModalOpen(true);
      return null;
    }

    // password
    if (id_usuario.contrasenia_usuario !== campos.password) {
      document.getElementById('password').classList.add('active');
      setModalMessage('Contraseña incorrecta');
      setIsModalOpen(true);
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
        setModalMessage(`Nombre o contraseña incorrecto`);
        setIsModalOpen(true);
        return;
      }

      try {
        // guardar user
        signOn(user);

        // redireccionar
        setRedirectTo('/');
      } catch (error) {
        console.error('Error:', error);
        setModalMessage(`Error al establecer conexión`);
        setIsModalOpen(true);
      }
    } catch (error) {
      e.preventDefault();
      setModalMessage('Hubo un error al crear la carpeta, Intenta nuevamente');
      setIsModalOpen(true);
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