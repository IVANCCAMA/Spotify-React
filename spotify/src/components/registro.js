import axios from 'axios';
import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { alfanumerico, verificarString } from './form.js';
import './form.css'
import Alerta from './alerta';

function Registro() {
  const database = 'https://spfisbackend-production.up.railway.app/api';
  const userTypes = ['Distribuidora musical', 'Oyente'];
  const requirements = [
    { validOption: "longitudMin", p: "La contraseña debe tener al menos 8 caracteres" },
    { validOption: "mayusculas", p: "La contraseña debe tener al menos una letra mayúscula" },
    { validOption: "minusculas", p: "La contraseña debe tener al menos una letra minúscula" },
    { validOption: "numeros", p: "La contraseña debe tener al menos un número" },
    { validOption: "specialChars", p: "La contraseña debe tener al menos un carácter especial" }
  ];

  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

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
    if (campos.password.length < 8) {
      document.getElementById('password').classList.add('active');
      return null;
    }
    if (campos.passwordConfirm.length < 8) {
      document.getElementById('passwordConfirm').classList.add('active');
      return null;
    }
    if (campos.userType === 'default' || campos.userType.length < 1) {
      return null;
    }

    // nombre
    const id_usuario = await ExisteArtista(campos.username);
    if (id_usuario != null) {
      setModalMessage(`El nombre que deseas registrar ya está en uso, escoge otro`);
      await setIsModalOpen(true);
      document.getElementById('username').classList.add('active');
      return null;
    }

    // passwprd
    for (const req of requirements) {
      if (!verificarString(campos.password, "", req.validOption)) {
        document.getElementById('password').classList.add('active');
        setModalMessage(`La contraseña no cumple con las especificaciones`);
        await setIsModalOpen(true);
        return null;
      }
    }

    // passwordConfirm
    if (campos.password !== campos.passwordConfirm) {
      document.getElementById('passwordConfirm').classList.add('active');
      setModalMessage(`La confirmacion y la contraseña no coinciden`);
      await setIsModalOpen(true);
      return null;
    }

    // userTypes
    for (const userType of userTypes) {
      if (campos.userType === userType) {
        try {
          return {
            nombre_usuario: campos.username,
            correo_usuario: `${campos.username.replace(/ /g, '_')}@localhost`,
            contrasenia_usuario: campos.password,
            tipo_usuario: campos.userType,
            fecha_nacimiento: "2020-08-03"
          };
        } catch (error) {
          setModalMessage(`Error al encriptar la contraseña`);
          await setIsModalOpen(true);
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

  const handlePassword = (e) => {
    const password = e.target.value;
    const hasInput = password.length > 0;
    //Editeo
    const isPasswordValid = requirements.every(req => verificarString(password, "", req.validOption));
    //
    requirements.forEach(req => {
      const element = document.getElementById(`requerimiento-${req.validOption}`);
      const isValid = hasInput && verificarString(password, "", req.validOption);
  
      element.classList.toggle('active', isValid);
    });
  
    e.target.classList.toggle('active', hasInput && !isPasswordValid);
    //Editeo
    //  Confirmar Contraseña
    const confirmPasswordInput = document.getElementById('passwordConfirm');
    confirmPasswordInput.classList.toggle('active', confirmPasswordInput.value !== password || !isPasswordValid);
  }
  

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
                type={passwordVisible ? "text" : "password"}
                className="validar"
                id="password"
                name="password"
                placeholder="Escriba su contraseña"
                onChange={handlePassword}
                onFocus={(e) => { e.target.nextElementSibling.style.display = 'block'; }}
                onBlur={(e) => { e.target.nextElementSibling.style.display = 'none'; }}
              />
              <div className="ventana-informacion">
                {requirements.map((req) => (
                  <p id={`requerimiento-${req.validOption}`} key={req.validOption}>{req.p}</p>
                ))}
              </div>
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
            <div className="input-box">
              <label htmlFor="passwordConfirm">Confirmar contraseña *</label>
              <input required
                autoComplete="new-password"
                type={passwordConfirmVisible ? "text" : "password"}
                className="validar"
                id="passwordConfirm"
                name="passwordConfirm"
                placeholder="Confirme su contraseña"
                onChange={(e) => {
                  const passwordInput = document.getElementById('password');
                  //Editeo
                  const isPasswordValid = requirements.every(req => verificarString(passwordInput.value, "", req.validOption));
                  e.target.classList.toggle('active', e.target.value !== passwordInput.value || !isPasswordValid);
                }}
              />
              <button
                type='button'
                className='ojito'
                onClick={() => { setPasswordConfirmVisible(!passwordConfirmVisible); }}
              >
                {passwordConfirmVisible ? (< VscEye />) : (<VscEyeClosed />)}
              </button>
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
