import React, { useState, useEffect } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import './form.css';
import axios from 'axios';
import Alerta from './alerta';
import { alfanumerico } from './form.js';
import { useNavigate } from 'react-router-dom';

function IniciarSesion({ showForm = true, signOn }) {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [btnCancel, setBtnCancel] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const navigate = useNavigate();

  const location = useLocation();
  const isLoginRoute = location.pathname === '/iniciarsesion';
  const dynamicStyle = {
    display: showForm !== btnCancel ? 'flex' : 'none',
    background: isLoginRoute ? '' : 'rgba(128, 128, 128, 0.5)'
  };

  function handleCloseAndRedirect() {
    setIsModalOpen(false);
    if (redirectTo) {
      window.location.replace(redirectTo);
    }
  }

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
      if (isOnline) {
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
          navigate('/Albumes');


        } catch (error) {
          console.error('Error:', error);
          setModalMessage(`Error al subir o procesar el archivo`);
          setIsModalOpen(true);
        }
      } else {
        e.preventDefault();
        setModalMessage('Hubo un error al crear la carpeta, Intenta nuevamente');
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
    <div className='form-contend' style={dynamicStyle}>
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
        <Alerta
          isOpen={isModalOpen}
          mensaje={modalMessage}
          onClose={handleCloseAndRedirect}
        />
      </div>
    </div>
  );
};

export default IniciarSesion;