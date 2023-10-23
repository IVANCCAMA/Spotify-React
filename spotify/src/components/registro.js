import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { RecuperarDuracion, SubirCancion, deleteFile, recuperarUrlCancion } from '../firebase/config';
import { alfanumerico } from './form.js';
import './form.css'
import Alerta from './alerta';
//import bcrypt from 'bcryptjs';

function Registro() {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const userTypes = ['Distribuidora musical', 'Oyente'];
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

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
        return artistaEncontrado.id_usuario;
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
    if (campos.password.length > 20 || campos.password.length < 1) {
      document.getElementById('password').classList.add('active');
      return null;
    }
    if (campos.passwordConfirm.length > 20 || campos.passwordConfirm.length < 1) {
      document.getElementById('passwordConfirm').classList.add('active');
      return null;
    }
    if (campos.userType === 'default' || campos.userType.length < 1) {
      return null;
    }

    // nombre
    const id_usuario = await ExisteArtista(campos.username);
    if (id_usuario != null) {
      console.log('Error, nombre en uso intente otro');
      document.getElementById('username').classList.add('active');
      return null;
    }

    // passwprd
    // revisar que tenga las especificaciones de una password

    // passwordConfirm
    if (campos.password !== campos.passwordConfirm) {
      console.log("Las contraseñas no coinciden.");
      document.getElementById('passwordConfirm').classList.add('active');
      return null;
    }

    // userTypes
    for (const userType of userTypes) {
      if (campos.userType === userType) {
        try {
          const saltRounds = 10;
          //const hash = await bcrypt.hash(campos.password, saltRounds);
          return {
            nombre_usuario: campos.username,
            correo_usuario: `${campos.username.replace(/ /g, '_')}@localhost`,
            contrasenia_usuario: campos.password,
            tipo_usuario: campos.userType,
            fecha_nacimiento: "2020-08-03"
          };
        } catch (error) {
          console.error("Error al encriptar la contraseña:", error);
          return null;
        }
      }
    }
    return null;
  }

  const subirBD = async (newUser) => {
    try {
      const query = `/usuarios/`;
      await axios.post(`${database}${query}`, newUser);
      return true;
    } catch (error) {
      console.error('Error al subir a la base de datos:', error);
      return false;
    }
  }

  const validarForm = async (e) => {
    // Deshabilitar el botón
    setBotonHabilitado(false);
    try {
      e.preventDefault();

      const campos = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        passwordConfirm: document.getElementById('passwordConfirm').value,
        userType: document.getElementById('userType').value
      };

      const newUser = await validarCampos(campos);
      if (newUser === null) {
        if (!modalMessage) {
          setModalMessage(`Asegúrese de que todos los campos estén llenados correctamente`);
        }
        setIsModalOpen(true);
        return;
      }

      try {
        const subidaExitosa = await subirBD(newUser);
        if (!subidaExitosa) {
          setModalMessage(`Error al cargar la canción. Intente más tarde`);
          setIsModalOpen(true);
          return;
        }

        setModalMessage(`Registro creado exitosamente`);
        setIsModalOpen(true);
        setRedirectTo("/");
      } catch (error) {
        console.error('Error:', error);
        setModalMessage(`Error al procesar el nuevo usuario`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      // Una vez que se complete, habilitar el botón nuevamente
      setBotonHabilitado(true);
    }
  };

  const eliminarEspacios = (value) => {
    if (value === " ") {
      return "";
    }
    return value.replace(/\s+/g, ' ');
  };

  const handle = (e) => {
    let newValue = eliminarEspacios(e.target.value);
    if (alfanumerico(newValue)) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    if (newValue.length > 20) {
      newValue = newValue.slice(0, 20);
    }
    e.target.value = newValue;
  };

  return (
    <div className="modal-form">
      <form className="modal-box" id="form" onSubmit={validarForm}>
        <div className="inter-modal">
          <div className="campo">
            <div className="input-box">
              <label htmlFor="username">Nombre *</label>
              <input autoFocus required
                autoComplete="new-username"
                type="text"
                className="validar"
                id="username"
                name="username"
                placeholder="Escriba su nombre"
                onChange={handle}
                onBlur={(e) => { e.target.value = e.target.value.trim(); }}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="password">Contraseña *</label>
              <input required
                autoComplete="new-password"
                type="password"
                className="validar"
                id="password"
                name="password"
                placeholder="Escriba su contraseña"
                onChange={handle}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-box">
              <label htmlFor="passwordConfirm">Confirmar contraseña *</label>
              <input required
                autoComplete="new-password"
                type="password"
                className="validar"
                id="passwordConfirm"
                name="passwordConfirm"
                placeholder="Confirme su contraseña"
                onChange={handle}
              />
            </div>
          </div>

          <div className="campo">
            <div className="input-boxx">
              <label className="elemento" htmlFor="userType">Tipo de usuario *</label>
              <select name="userType" id='userType' defaultValue={'default'} required>
                <option disabled hidden value='default'>Seleccionar tipo de usuario</option>
                {userTypes.map((userType) => (
                  <option key={userType} value={userType}>{userType}</option>
                ))}
              </select>
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
      <Alerta
        isOpen={isModalOpen}
        mensaje={modalMessage}
        onClose={handleCloseAndRedirect}
      />
    </div>
  );
};

export default Registro;
